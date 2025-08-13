import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { User, type IUser } from '@sustainovate/shared/schemas';

// Environment variables
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_REDIRECT_URI) {
  throw new Error('Missing Discord OAuth configuration in environment variables');
}

// Configure Discord OAuth Strategy
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
