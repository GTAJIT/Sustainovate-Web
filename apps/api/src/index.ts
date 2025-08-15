import '@sustainovate/shared/config';

import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import { Server } from 'socket.io';
import { io as ClientIO } from 'socket.io-client';
import amqp from 'amqplib';
import { connectDB, redis } from '@sustainovate/shared/config';
import { User } from '@sustainovate/shared/schemas';

// Import authentication
import passport from './config/passport.js';
import authRoutes from './routes/auth.js';
import { authenticateToken, optionalAuth } from './middleware/auth.js';
import { generalLimiter, authLimiter } from './middleware/rateLimiter.js';
import { createUser } from './routes/register/userCreate.js';

const PORT = process.env.PORT || 4000;
const RABBITMQ_URL = process.env.RABBITMQ_URL;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const SESSION_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
      credentials: true,
    },
  });

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'wss:', 'ws:'],
        },
      },
    }),
  );

  // CORS configuration
  app.use(
    cors({
      origin: FRONTEND_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // Rate limiting
  app.use('/api', generalLimiter);
  app.use('/auth', authLimiter);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Session configuration for Passport
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Basic routes
  app.get('/', (req, res) =>
    res.json({
      status: 'Sustainovate API is running',
      version: '1.0.0',
      docs: '/api/docs',
    }),
  );

  app.get('/api/v1', optionalAuth, (req, res) => {
    res.json({
      status: 'API v1 is running',
      authenticated: !!req.user,
      user: req.user
        ? {
            username: req.user.username,
            role: req.user.role,
          }
        : null,
    });
  });
  app.post('/api/v1', optionalAuth, (req, res) => {});

  // Authentication routes
  app.use('/auth', authRoutes);

  // Protected API routes
  app.get('/api/v1/profile', authenticateToken, (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    res.json({
      message: 'This is a protected route',
      user: {
        id: (req.user._id as any).toString(),
        username: req.user.username,
        role: req.user.role,
      },
    });
  });

  // Database test routes
  app.get('/test-db', async (req, res) => {
    try {
      await connectDB();
      const userCount = await User.countDocuments();
      res.json({
        message: 'Database connected',
        userCount,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        error: 'Database connection failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  app.get('/test-redis', async (req, res) => {
    try {
      await redis.set('test', `Hello at ${new Date().toISOString()}`);
      const value = await redis.get('test');
      res.json({
        message: 'Redis connected',
        value,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        error: 'Redis connection failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  app.get('/test', async (req, res) => {
  // Helper to safely extract a string
  const getString = (value: unknown, fallback: string) =>
    typeof value === 'string' ? value : fallback;

  const username = getString(req.query.name, 'one');
  const email = getString(req.query.email, 'one@one.one');
  const pass = getString(req.query.pass, '12345');

  try {
    await createUser(username, email, pass);
    res.status(200).json({ name: 'done :)' });
  } catch (error) {
    res.status(500).json({
      error: 'connection failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});


  // RabbitMQ connection
  try {
    if (RABBITMQ_URL) {
      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();
      console.log('Connected to RabbitMQ - ✅');

      const queue = 'auth_events';
      await channel.assertQueue(queue);
      console.log(`Queue '${queue}' is ready`);
    }
  } catch (err) {
    console.error('RabbitMQ connection failed: ', err);
  }

  // Database connection
  try {
    await connectDB();
    console.log('Connected to MongoDB - ✅');
  } catch (error) {
    console.error('MongoDB connection failed: ', error);
    process.exit(1);
  }

  // Socket.IO with authentication
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

      if (token) {
        // Verify token and attach user to socket
        const { verifyToken } = await import('./utils/jwt.js');
        const payload = verifyToken(token);
        const user = await User.findById(payload.userId);

        if (user && user.isActive) {
          socket.data.user = user;
        }
      }

      next();
    } catch (error) {
      // Allow connection even without valid token for public features
      next();
    }
  });

  // Socket.IO events
  io.on('connection', (socket) => {
    const user = socket.data.user;

    if (user) {
      console.log(`Authenticated user connected: ${user.username} (${socket.id})`);
      socket.join(`user:${user.discordId}`);

      // Send welcome message to authenticated users
      socket.emit('authenticated', {
        message: `Welcome back, ${user.globalName || user.username}!`,
        user: {
          username: user.username,
          role: user.role,
        },
      });
    } else {
      console.log(`Anonymous user connected: ${socket.id}`);
    }

    socket.emit('welcome', {
      message: 'Connected to Sustainovate API',
      timestamp: new Date().toISOString(),
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      if (user) {
        console.log(`User disconnected: ${user.username} (${socket.id})`);
      } else {
        console.log(`Anonymous user disconnected: ${socket.id}`);
      }
    });
  });

  // Error handling middleware
  app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && { details: error.message }),
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not Found',
      code: 'NOT_FOUND',
      path: req.path,
      method: req.method,
    });
  });

  server.listen(PORT, () => {
    console.log(`🚀 Sustainovate API listening on http://localhost:${PORT}`);
    console.log(`📚 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Discord Auth: http://localhost:${PORT}/auth/discord`);
    console.log(`🔗 Frontend URL: ${FRONTEND_URL}`);

    // Optional: Test client connection from server
    if (process.env.NODE_ENV === 'development') {
      const clientSocket = ClientIO(`http://localhost:${PORT}`);
      clientSocket.on('welcome', (data) => {
        console.log('WebSocket test:', data.message);
        clientSocket.disconnect();
      });
    }
  });
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer().catch(console.error);
