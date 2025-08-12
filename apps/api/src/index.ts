import "../../../shared/config/dotenv-loader.ts";

import express from "express";
import http from "http";
import { Server } from "socket.io";
import { io as ClientIO } from "socket.io-client"; // <-- client import
import amqp from "amqplib";
import {prisma} from "../../../shared/config/db.ts";
import { redis } from "../../../shared/config/redis.ts";


const PORT = process.env.PORT || 3000;
const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: "*" } });

  // Middleware
  app.use(express.json());

  // Test routes
  app.get("/", (_, res) => res.send({ status: "API is running" }));
  app.get("/api/v1", (_, res) =>
    res.send({ status: "API is running at /api/v1 " })
  );

  //tests
  app.get("/test-db", async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get("/test-redis", async (_req, res) => {
  await redis.set("hello", "world");
  const value = await redis.get("hello");
  res.send(`Redis says: ${value}`);
});

  // RabbitMQ connection
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    console.log("Connected to RabbitMQ - ✅");

    const queue = "test_queue";
    await channel.assertQueue(queue);
    console.log(`Queue '${queue}' is ready`);
  } catch (err) {
    console.error("RabbitMQ connection failed: ", err);
  }

  // Socket.IO server events
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.emit("welcome", { message: "Hello from Socket.IO server!" });
  });

  server.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);

    // Optional: Test client connection from server
    const clientSocket = ClientIO(`http://localhost:${PORT}`);
    clientSocket.on("welcome", (data: string) => {
      console.log("Server says:", data);
    });
  });
}

startServer();
