# 🔐 Discord Authentication Setup Guide

This guide will help you set up Discord OAuth2 authentication for the Sustainovate platform.

## 🚀 Quick Setup

### 1. Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name (e.g., "Sustainovate Platform")
4. Go to the "OAuth2" section

### 2. Configure OAuth2

1. In the OAuth2 section, add these redirect URIs:
   - `http://localhost:4000/auth/discord/callback` (development)
   - `https://yourdomain.com/auth/discord/callback` (production)

2. Note down:
   - **Client ID**
   - **Client Secret**

### 3. Environment Variables

Add these to your `.env` file:

```env
# Discord OAuth Configuration
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_CLIENT_SECRET=your_discord_client_secret_here
DISCORD_REDIRECT_URI=http://localhost:4000/auth/discord/callback
DISCORD_BOT_TOKEN=your_bot_token_here_if_needed

# Frontend URL
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
```

### 4. Test Authentication

1. Start your API server:
   ```bash
   npm run dev --workspace=apps/api
   ```

2. Visit the Discord auth URL:
   ```
   http://localhost:4000/auth/discord
   ```

3. You should be redirected to Discord, then back to your frontend with a token.

## 🔧 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/auth/discord` | Initiate Discord OAuth |
| `GET` | `/auth/discord/callback` | Discord OAuth callback |
| `POST` | `/auth/logout` | Logout user |
| `GET` | `/auth/me` | Get current user profile |
| `GET` | `/auth/check` | Check token validity |
| `GET` | `/auth/profile/:discordId` | Get public user profile |

### Protected Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/profile` | Protected user profile | ✅ Yes |
| `GET` | `/api/v1` | API status with user info | ❌ Optional |

## 🛡️ Security Features

- ✅ **JWT Tokens** with configurable expiration
- ✅ **Rate Limiting** on auth endpoints
- ✅ **CORS** configuration
- ✅ **Helmet.js** security headers
- ✅ **Session management** for OAuth flow
- ✅ **User role management** (user/admin/moderator)
- ✅ **Token validation** middleware
- ✅ **WebSocket authentication**

## 🎯 Usage Examples

### Frontend Integration

```javascript
// Redirect to Discord auth
window.location.href = 'http://localhost:4000/auth/discord';

// Handle successful auth (on /auth/success page)
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
  localStorage.setItem('authToken', token);
  // Redirect to dashboard
}

// Make authenticated requests
const response = await fetch('http://localhost:4000/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
});
```

### WebSocket with Auth

```javascript
const socket = io('http://localhost:4000', {
  auth: {
    token: localStorage.getItem('authToken')
  }
});

socket.on('authenticated', (data) => {
  console.log(data.message); // Welcome message for authenticated users
});
```

## ⚠️ Important Notes

1. **Never expose your Discord Client Secret** in frontend code
2. **Use HTTPS in production** for secure token transmission
3. **Implement token refresh** for long-lived applications
4. **Store tokens securely** (consider httpOnly cookies for web apps)
5. **Validate all user input** and sanitize data

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Make sure the redirect URI in Discord matches exactly
   - Check for trailing slashes

2. **"Cannot find module"**
   - Run `npm install` to install dependencies
   - Rebuild shared package: `npm run build --workspace=packages/shared`

3. **"JWT_SECRET is required"**
   - Add JWT_SECRET to your .env file
   - Make sure it's at least 32 characters long

4. **CORS errors**
   - Check that FRONTEND_URL is set correctly
   - Verify your frontend is running on the expected port
