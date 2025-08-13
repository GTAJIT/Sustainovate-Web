# 🌱 Sustainovate Live Platform

**The official Sustainovate platform** for hosting real-time quizzes, polls, and events with live leaderboards and engagement analytics.

---

## 🚀 Features
- **Admin Dashboard** – Manage quizzes, polls, events in real time
- **Live Analytics** – See answers, speed, and accuracy instantly
- **Scheduled Events** – Plan quizzes for the future
- **PWA Support** – Install and run like an app
- **QR Code Login** – Fast entry for participants
- **Leaderboard** – Gamified ranking system
- **Data Export** – CSV/PDF reports for admins

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
| **Socket.IO**   | Real-time updates | Live quizzes and leaderboards |
| **PostgreSQL**  | Main database | Reliable and powerful relational DB |
| **TimescaleDB** | Time-series DB | Speed & accuracy tracking over time |
| **Redis**       | In-memory cache | Ultra-fast leaderboard updates |
| **BullMQ**      | Job queue | Background task processing |

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
   
   # Install dependencies and setup workspace
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your local database credentials
   ```

3. **Start development environment**
   ```bash
   # Option 1: Docker (recommended - includes all services)
   docker-compose up --build
   
   # Option 2: Local development (requires local DB setup)
   npm run dev
   ```

4. **Access the application**
   - **API Server**: http://localhost:4000
   - **RabbitMQ Management**: http://localhost:15672 (guest/guest)
   - **PostgreSQL**: localhost:5432

### **Development Commands**
```bash
# Run all services in development mode
npm run dev

# Build all packages
npm run build

# Run tests
npm run test

# Lint and format code
npm run lint
npm run format

# Type checking
npm run type-check

# Clean all build artifacts
npm run clean
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