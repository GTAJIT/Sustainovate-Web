import express from 'express';
import passport from '../config/passport.js';
import { generateToken } from '../utils/jwt.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { User, type IUser } from '@sustainovate/shared/schemas';
import { createUser } from './register/userCreate.js';

const router = express.Router();

// Environment variables
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * GET /auth/discord
 * Initiate Discord OAuth flow
 */
router.get('/discord', passport.authenticate('discord'));

/**
 * GET /auth/discord/callback
 * Discord OAuth callback
 */
router.get('/discord/callback', 
  passport.authenticate('discord', { 
    failureRedirect: `${FRONTEND_URL}/login?error=auth_failed` 
  }),
  (req, res) => {
    try {
      const user = req.user as IUser;
      
      if (!user) {
        return res.redirect(`${FRONTEND_URL}/login?error=no_user`);
      }

      // Generate JWT token
      const token = generateToken(user);
      
      // Set secure cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      // Redirect to frontend
      res.redirect(`${FRONTEND_URL}/auth/success`);
    } catch (error) {
      console.error('Discord auth callback error:', error);
      res.redirect(`${FRONTEND_URL}/login?error=callback_failed`);
    }
  }
);

/**
 * GET /auth/github
 * Initiate GitHub OAuth flow
 */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

/**
 * GET /auth/github/callback
 * GitHub OAuth callback
 */
router.get('/github/callback', 
  passport.authenticate('github', { 
    failureRedirect: `${FRONTEND_URL}/login?error=auth_failed` 
  }),
  (req, res) => {
    try {
      const user = req.user as IUser;
      
      if (!user) {
        return res.redirect(`${FRONTEND_URL}/login?error=no_user`);
      }

      // Generate JWT token
      const token = generateToken(user);
      
      // Set secure cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      // Redirect to frontend
      res.redirect(`${FRONTEND_URL}/auth/success`);
    } catch (error) {
      console.error('GitHub auth callback error:', error);
      res.redirect(`${FRONTEND_URL}/login?error=callback_failed`);
    }
  }
);

/**
 * POST /auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Logged out successfully',
    success: true 
  });
});

/**
 * GET /auth/me
 * Get current user profile
 */
router.get('/me', authenticateToken, (req, res) => {
  const user = req.user as IUser;
  
  // Return user data without sensitive fields
  res.json({
    id: user._id,
    discordId: user.discordId,
    username: user.username,
    globalName: user.globalName,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    verified: user.verified,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  });
});

/**
 * GET /auth/profile/:discordId
 * Get public user profile by Discord ID (optional auth)
 */
router.get('/profile/:discordId', optionalAuth, async (req, res) => {
  try {
    const { discordId } = req.params;
    const user = await User.findOne({ discordId, isActive: true });
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND' 
      });
    }

    // Public profile data
    const publicProfile = {
      discordId: user.discordId,
      username: user.username,
      globalName: user.globalName,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
    };

    // Include email if requesting own profile or admin
    const requestingUser = req.user as IUser;
    if (requestingUser && (requestingUser.discordId === discordId || requestingUser.role === 'admin')) {
      (publicProfile as any).email = user.email;
      (publicProfile as any).verified = user.verified;
      (publicProfile as any).lastLoginAt = user.lastLoginAt;
    }

    res.json(publicProfile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR' 
    });
  }
});

/**
 * GET /auth/check
 * Check if token is valid (optional auth)
 */
router.get('/check', optionalAuth, (req, res) => {
  res.json({
    authenticated: !!req.user,
    user: req.user ? {
      id: (req.user._id as any).toString(),
      username: req.user.username,
      role: req.user.role,
    } : null,
  });
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const result = await createUser(username, email, password);
  res.status(result.success ? 201 : 400).json(result);
});

export default router;
