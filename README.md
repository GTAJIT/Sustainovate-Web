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
We use **a microservice-ready structure** with separate repos for scalability:
```
Sustainovate-Web/                # Root of your GitHub repo
├── apps/
│   ├── web/             # Frontend (Next.js + Tailwind)
│   └── api/             # Backend (Express + Socket.IO)
├── services/
│   ├── jobs/            # Async workers (BullMQ)
│   └── export/          # Result export / PDF service
├── shared/              # Common logic (schemas, utils)
├── docker-compose.yml   # Local dev environment
├── README.md
└── .github/workflows/   # CI/CD
```


<!-- ---

## 🐳 Local Development (with Docker)
We use `docker-compose` to run everything locally in one command.

```bash
# Start all services
docker-compose up --build

# Stop all services
docker-compose down
``` -->