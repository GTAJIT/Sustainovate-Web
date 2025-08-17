/* eslint-disable @typescript-eslint/no-explicit-any */
import User from "../user/modle";

export type Provider = "google" | "github" | "discord";

export interface OAuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  tokens: {
    access_token: string;
    refresh_token?: string;
  };
}

export async function linkOrCreateUser(provider: Provider, oauthUser: OAuthUser) {
  let user = await User.findOne({
    $or: [
      { email: oauthUser.email },
      {
        "authProviders.provider": provider,
        "authProviders.providerId": oauthUser.id,
      },
    ],
  });

  if (user) {
    const alreadyLinked = user.authProviders.some(
      (p: any) => p.provider === provider && p.providerId === oauthUser.id,
    );

    if (!alreadyLinked) {
      user.authProviders.push({
        provider,
        providerId: oauthUser.id,
        accessToken: oauthUser.tokens.access_token,
        refreshToken: oauthUser.tokens.refresh_token,
      });
    } else {
      user.authProviders = user.authProviders.map((p: any) =>
        p.provider === provider && p.providerId === oauthUser.id
          ? {
              ...p,
              accessToken: oauthUser.tokens.access_token,
              refreshToken: oauthUser.tokens.refresh_token ?? p.refreshToken,
            }
          : p,
      );
    }
  } else {
    user = new User({
      username: oauthUser.name,
      email: oauthUser.email,
      avatar: oauthUser.avatar,
      authProviders: [
        {
          provider,
          providerId: oauthUser.id,
          accessToken: oauthUser.tokens.access_token,
          refreshToken: oauthUser.tokens.refresh_token,
        },
      ],
    });
  }

  await user.save();
  return user;
}
