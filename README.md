# 🌱 Sustainovate Live Platform

**The official Sustainovate platform** for hosting real-time quiz3. **OAuth Setup** (Choose your pref5. **Access the application**
   - **API Server**: http://localhost:4000
   - **Discord Auth**: http://localhost:4000/auth/discord
   - **GitHub Auth**: http://localhost:4000/auth/github
   - **API Health**: http://localhost:4000/health
   - **RabbitMQ Management**: http://localhost:15672 (guest/guest) authentication method)
   
   **Discord OAuth:**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Add redirect URI: `http://localhost:4000/auth/discord/callback`
   - Copy Client ID and Secret to your `.env` file
   - See [Discord Auth Guide](./docs/DISCORD_AUTH.md) for detailed setup

   **GitHub OAuth:**
   - Go to [GitHub OAuth Apps](https://github.com/settings/applications/new)
   - Create a new OAuth app
   - Add callback URL: `http://localhost:4000/auth/github/callback`
   - Copy Client ID and Secret to your `.env` file
   - See [GitHub Auth Guide](./docs/GITHUB_AUTH.md) for detailed setupolls, and events with live leaderboards and engagement analytics.

---

## 🚀 Features
- **Discord Authentication** – Secure OAuth2 login with Discord
- **Admin Dashboard** – Manage quizzes, polls, events in real time
- **Live Analytics** – See answers, speed, and accuracy instantly
- **Scheduled Events** – Plan quizzes for the future
- **PWA Support** – Install and run like an app
- **QR Code Login** – Fast entry for participants
- **Leaderboard** – Gamified ranking system
- **Data Export** – CSV/PDF reports for admins
- **Role-based Access** – User, moderator, and admin permissions
- **Real-time WebSocket** – Live updates with authentication

---

## 🛠 Tech Stack

### **Frontend**
| Tool            | Purpose | Why We Use It |
| --------------- | ------- | ------------- |
| **Next.js**     | React framework | Fast, SEO-friendly, modern web apps |
| **Tailwind CSS**| Styling | Quick and responsive UI design |
| **Chart.js / Recharts** | Data visualization | Beautiful, animated charts |
| **Framer Motion** | Animations | Smooth UI/graph animations |

### **Backend**
| Tool            | Purpose | Why We Use It |
| --------------- | ------- | ------------- |
| **Node.js + Express** | Backend server | Fast and scalable |
| **Discord OAuth2** | Authentication | Secure user login via Discord |
| **JWT Tokens** | Session management | Stateless authentication |
| **Socket.IO**   | Real-time updates | Live quizzes and leaderboards |
| **MongoDB**     | Main database | Flexible document storage |
| **Redis**       | In-memory cache | Ultra-fast leaderboard updates |
| **RabbitMQ**    | Job queue | Background task processing |
| **Passport.js** | Auth middleware | OAuth2 strategy handling |

### **Architecture**
| Component         | Purpose |
| ----------------- | ------- |
| **live-gateway**  | Handles Socket.IO and real-time events |
| **leaderboard-service** | Manages Redis sorted sets for rankings |
| **export-service** | Generates CSV/PDF reports |
| **monolith-core** | Auth, quizzes, events, admin logic |

---

## 📂 Repository Structure
We use a **modern monorepo structure** with TypeScript and industry best practices:

```
Sustainovate-Web/                    # 🏠 Root monorepo
├── apps/                           # 🚀 Applications
│   └── api/                        # 🔌 Express + Socket.IO API
├── packages/                       # 📦 Shared packages
│   └── shared/                     # 🤝 Common logic (schemas, configs, utils)
├── services/                       # ⚙️ Microservices
│   ├── jobs/                       # 🔄 Background job processing
│   └── export/                     # 📊 Data export service
├── scripts/                        # 🛠️ Development & deployment scripts
├── tools/                          # 🔧 Build tools and configurations
├── .github/workflows/              # 🤖 CI/CD pipelines
├── docker-compose.yml              # 🐳 Local development environment
├── turbo.json                      # ⚡ Turborepo configuration
├── tsconfig.base.json              # 📝 Base TypeScript configuration
└── README.md                       # 📖 This file
```

### **Package Architecture**
- **`@sustainovate/api`** – Main REST API and WebSocket server
- **`@sustainovate/shared`** – Database models, configs, utilities
- **`@sustainovate/jobs`** – Background processing (email, notifications)
- **`@sustainovate/export`** – Report generation and data export


---

## � Quick Start

### **Prerequisites**
- **Node.js 18+** and **npm 8+**
- **Docker & Docker Compose** (for local development)
- **Git** (for version control)

### **Local Development**

1. **Clone and setup**
   ```bash
   git clone https://github.com/0xmainak/Sustainovate-Web.git
   cd Sustainovate-Web
   
   # Automated setup (installs dependencies, creates .env, builds packages)
   npm run setup
   ```

2. **Configure Discord OAuth** (Required for authentication)
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Add redirect URI: `http://localhost:4000/auth/discord/callback`
   - Copy Client ID and Secret to your `.env` file
   - See [Discord Auth Guide](./docs/DISCORD_AUTH.md) for detailed setup

3. **Start development environment**
   ```bash
   # Option 1: Start API server only
   npm start
   
   # Option 2: Start API in development mode (with hot reload)
   npm run dev:api
   
   # Option 3: Start all services in development
   npm run dev:all
   
   # Option 4: Docker (recommended - includes databases)
   npm run docker:up
   ```

4. **Access the application**
   - **API Server**: http://localhost:4000
   - **Discord Auth**: http://localhost:4000/auth/discord
   - **API Health**: http://localhost:4000/health
   - **RabbitMQ Management**: http://localhost:15672 (guest/guest)

### **Development Commands (All run from root directory)**
```bash
# 🚀 Getting Started
npm run setup           # Initial project setup (one-time)
npm start              # Start API server (production build)
npm run dev:api        # Start API in development mode
npm run dev:all        # Start all services in development

# 🏗️ Building
npm run build          # Build all packages
npm run build:api      # Build API only
npm run build:shared   # Build shared package only

# 🐳 Docker
npm run docker:up      # Start all services with Docker
npm run docker:down    # Stop Docker services
npm run docker:dev     # Start in development mode with Docker

# 🔧 Utilities
npm run test           # Run tests
npm run lint           # Lint code
npm run format         # Format code
npm run type-check     # Type checking
npm run clean          # Clean all build artifacts

# 🚀 Production (PM2)
npm run pm2:start      # Start with PM2
npm run pm2:stop       # Stop PM2 processes
npm run pm2:restart    # Restart PM2 processes
npm run pm2:logs       # View PM2 logs
npm run pm2:status     # Check PM2 status
```

---

## 🚀 Production Deployment (PM2)

### **PM2 Process Manager**
We use PM2 for production process management with clustering, monitoring, and auto-restart capabilities.

### **Quick Production Start**
```bash
# Build and start all services in production
npm run build
npm run pm2:start:prod

# Or use the automated script
./scripts/start-production.ps1
```

### **PM2 Commands**
```bash
# Process Management
npm run pm2:start          # Start all services
npm run pm2:stop           # Stop all services
npm run pm2:restart        # Restart all services
npm run pm2:reload         # Reload with zero downtime
npm run pm2:delete         # Delete all processes

# Monitoring & Logs
npm run pm2:status         # Show process status
npm run pm2:logs           # View logs in real-time
npm run pm2:monit          # Open monitoring dashboard
npm run pm2:flush          # Clear all logs

# Production & Deployment
npm run pm2:start:prod     # Start in production mode
npm run pm2:deploy:prod    # Deploy to production server
npm run pm2:deploy:staging # Deploy to staging server
```

### **Service Configuration**
- **sustainovate-api**: Main API server (1 instance, cluster mode)
- **sustainovate-jobs**: Background workers (2 instances, cluster mode)
- **sustainovate-export**: Export service (1 instance, fork mode)

### **Automatic Features**
- ✅ **Auto-restart** on crashes
- ✅ **Memory monitoring** (restart if exceeds limits)
- ✅ **Log rotation** with timestamps
- ✅ **Zero-downtime reloads**
- ✅ **Daily restart** (jobs service at 2 AM)
- ✅ **Cluster mode** for high availability