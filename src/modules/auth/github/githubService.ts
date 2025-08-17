import axios from "axios";

import { OAuthUser } from "../authService"; // adjust path

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI!;

export function getGithubAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: "read:user user:email",
    allow_signup: "true",
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function getGithubUser(code: string): Promise<OAuthUser> {
  // 1. Exchange code for token
  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: GITHUB_REDIRECT_URI,
    },
    { headers: { Accept: "application/json" } },
  );

  const accessToken = tokenRes.data.access_token;
  if (!accessToken) throw new Error("GitHub authentication failed: no access token");

  // 2. Get user profile
  const userRes = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // 3. Get primary email
  const emailRes = await axios.get("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const primaryEmail = emailRes.data.find((e: any) => e.primary)?.email;

  // ✅ Normalize into OAuthUser
  return {
    id: userRes.data.id.toString(),
    email: primaryEmail ?? userRes.data.email,
    name: userRes.data.name || userRes.data.login,
    avatar: userRes.data.avatar_url,
    tokens: { access_token: accessToken },
  };
}
