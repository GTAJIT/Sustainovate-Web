import rateLimit from 'express-rate-limit';

// General API rate limiting
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth-specific rate limiting (stricter)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Discord OAuth rate limiting
export const discordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 Discord OAuth attempts per hour
  message: {
    error: 'Too many Discord authentication attempts',
    code: 'DISCORD_RATE_LIMIT_EXCEEDED',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
