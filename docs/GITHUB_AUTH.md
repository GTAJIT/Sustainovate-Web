# GitHub OAuth Setup Guide

## 🔐 Setting up GitHub OAuth Authentication

### **Step 1: Create GitHub OAuth App**

1. **Go to GitHub Settings**: https://github.com/settings/applications/new
2. **Fill in the application details**:
   - **Application name**: `Sustainovate` (or your preferred name)
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Application description**: `Sustainovate Web Application OAuth`
   - **Authorization callback URL**: `http://localhost:4000/auth/github/callback`

3. **Click "Register application"**

4. **Copy your credentials**:
   - **Client ID**: Copy this value
   - **Client Secret**: Generate and copy this value

### **Step 2: Update Environment Variables**

Update your `.env` file with your GitHub OAuth credentials:

```bash
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_actual_github_client_id
GITHUB_CLIENT_SECRET=your_actual_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:4000/auth/github/callback
```

### **Step 3: Test GitHub Authentication**

1. **Start your server**:
   ```bash
   npm run dev
   ```

2. **Test GitHub OAuth flow**:
   - Navigate to: http://localhost:4000/auth/github
   - You'll be redirected to GitHub for authorization
   - After approval, you'll be redirected back to your app

### **Available GitHub OAuth Endpoints**

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/auth/github` | GET | Start GitHub OAuth flow |
| `/auth/github/callback` | GET | GitHub OAuth callback (automatic) |
| `/auth/me` | GET | Get current user info (works for both Discord & GitHub) |
| `/auth/logout` | POST | Logout user |
| `/auth/check` | GET | Check if token is valid |

### **GitHub User Data Collected**

When users authenticate with GitHub, we collect:

- **Username**: GitHub username
- **Email**: Primary email from GitHub
- **Full Name**: Display name from GitHub profile
- **Avatar**: Profile picture URL
- **GitHub ID**: Unique GitHub user identifier
- **Access Token**: For making GitHub API calls (stored securely)

### **Production Setup**

For production deployment, update the callback URL in your GitHub OAuth app:

```
https://yourdomain.com/auth/github/callback
```

And update your environment variables:

```bash
GITHUB_CALLBACK_URL=https://yourdomain.com/auth/github/callback
FRONTEND_URL=https://yourdomain.com
```

### **Security Features**

- ✅ **Secure Token Storage**: JWT tokens stored in httpOnly cookies
- ✅ **User Data Sync**: Latest GitHub profile data synced on each login
- ✅ **Role-based Access**: Users get 'user' role by default
- ✅ **Session Management**: Secure session handling with Passport.js
- ✅ **CORS Protection**: Configured for your domains only

### **Testing the Integration**

```bash
# Test GitHub OAuth
curl http://localhost:4000/auth/github

# Check authentication status
curl http://localhost:4000/auth/check

# Get user profile (requires authentication)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:4000/auth/me
```

---

## 🔄 **Dual OAuth Support**

Your application now supports **both Discord and GitHub OAuth**:

- Users can sign in with either Discord or GitHub
- User profiles are stored with provider-specific data
- JWT tokens indicate which provider was used
- Both providers redirect to the same success page

**Choose your authentication method**:
- Discord: `http://localhost:4000/auth/discord`
- GitHub: `http://localhost:4000/auth/github`
