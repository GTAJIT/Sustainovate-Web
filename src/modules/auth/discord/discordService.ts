import axios from "axios";

import { OAuthUser } from "../authService";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const DISCORD_CALLBACK_URL = process.env.DISCORD_CALLBACK_URL!;

export function getDiscordAuthUrl() {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_CALLBACK_URL,
    response_type: "code",
    scope: "identify email",
    prompt: "consent",
  });

  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

export async function getDiscordUser(code: string): Promise<OAuthUser> {
  // 🔑 Exchange code for tokens
  const tokenRes = await axios.post(
    "https://discord.com/api/oauth2/token",
    new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: DISCORD_CALLBACK_URL,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
  );

  const tokens = tokenRes.data;

  // 👤 Fetch user profile
  const userRes = await axios.get("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  const profile = userRes.data;

  if (!profile.id || !profile.email) {
    throw new Error("Discord authentication failed: incomplete profile");
  }

  return {
    id: profile.id,
    email: profile.email,
    name: profile.username,
    avatar: profile.avatar
      ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
      : null,
    tokens: {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token ?? undefined,
    },
  };
}
