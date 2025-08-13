import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User, type IUser } from '@sustainovate/shared/schemas';

// Environment variables
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

const isProduction = process.env.NODE_ENV === 'production';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_REDIRECT_URI) {
  console.warn('Missing Discord OAuth configuration in environment variables');
}

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !GITHUB_CALLBACK_URL) {
  console.warn('Missing GitHub OAuth configuration in environment variables');
}

// Configure Discord OAuth Strategy
if (DISCORD_CLIENT_ID && DISCORD_CLIENT_SECRET && DISCORD_REDIRECT_URI) {
  passport.use(new DiscordStrategy({
    clientID: DISCORD_CLIENT_ID,
    clientSecret: DISCORD_CLIENT_SECRET,
    callbackURL: DISCORD_REDIRECT_URI,
    scope: ['identify', 'email'],
  }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ discordId: profile.id });
      
      if (user) {
        // Update existing user with latest Discord data
        user.username = profile.username;
        user.globalName = profile.global_name;
        user.email = profile.email;
        user.avatar = profile.avatar;
        user.discriminator = profile.discriminator;
        user.verified = profile.verified;
        user.locale = profile.locale;
        user.mfaEnabled = profile.mfa_enabled;
        user.premiumType = profile.premium_type;
        user.publicFlags = profile.public_flags;
        user.flags = profile.flags;
        user.banner = profile.banner;
        user.accentColor = profile.accent_color;
        user.lastLoginAt = new Date();
        
        await user.save();
      } else {
        // Create new user
        user = new User({
          discordId: profile.id,
          username: profile.username,
          globalName: profile.global_name,
          email: profile.email,
          avatar: profile.avatar,
          discriminator: profile.discriminator,
          verified: profile.verified,
          locale: profile.locale,
          mfaEnabled: profile.mfa_enabled,
          premiumType: profile.premium_type,
          publicFlags: profile.public_flags,
          flags: profile.flags,
          banner: profile.banner,
          accentColor: profile.accent_color,
          role: 'user',
          isActive: true,
          authProvider: 'discord',
          lastLoginAt: new Date(),
        });
        
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      console.error('Discord OAuth error:', error);
      return done(error, null);
    }
  }));
}

// Configure GitHub OAuth Strategy
if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET && GITHUB_CALLBACK_URL) {
  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: GITHUB_CALLBACK_URL,
    scope: ['user:email']
  }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ githubId: profile.id });
      
      if (user) {
        // Update existing user with latest GitHub data
        user.username = profile.username;
        user.email = profile.emails?.[0]?.value;
        (user as any).fullname = profile.displayName;
        user.avatar = profile.photos?.[0]?.value;
        (user as any).githubAccessToken = accessToken;
        (user as any).githubRefreshToken = refreshToken;
        user.lastLoginAt = new Date();
        
        await user.save();
      } else {
        // Create new user
        user = new User({
          githubId: profile.id,
          username: profile.username,
          email: profile.emails?.[0]?.value,
          fullname: profile.displayName,
          avatar: profile.photos?.[0]?.value,
          githubAccessToken: accessToken,
          githubRefreshToken: refreshToken,
          role: 'user',
          isActive: true,
          authProvider: 'github',
          lastLoginAt: new Date(),
        });
        
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      return done(error, null);
    }
  }));
}

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
