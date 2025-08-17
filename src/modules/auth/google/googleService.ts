import { OAuth2Client } from "google-auth-library";

import { OAuthUser } from "../authService"; // adjust path if needed

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_CALLBACK_URL,
});

/**
 * Generate the Google OAuth2 login URL
 */
export function getGoogleAuthUrl(): string {
  const scopes = ["openid", "email", "profile"];

  return client.generateAuthUrl({
    access_type: "offline", // gets refresh_token on first consent
    prompt: "consent",
    scope: scopes,
  });
}

/**
 * Exchange authorization code for user profile
 */
export async function getGoogleUser(code: string): Promise<OAuthUser> {
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  if (!tokens.id_token) {
    throw new Error("Google authentication failed: missing ID token");
  }

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.sub || !payload.email || !payload.name) {
    throw new Error("Google authentication failed: incomplete user profile");
  }

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    avatar: payload.picture ?? undefined, // mapped to OAuthUser.avatar
    tokens: {
      access_token: tokens.access_token ?? "", // fallback to empty string
      refresh_token: tokens.refresh_token ?? undefined,
    },
  };
}
