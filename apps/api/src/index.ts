import express from "express";
import http from "http";
import { Server } from "socket.io";
import amqp from "amqplib";

const PORT = process.env.PORT || 4000;
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: "*" } });

  // Middleware
  app.use(express.json());

  // Test route
  app.get("/", (req, res) => {
    res.send({ status: "API is running" });
  });

  // RabbitMQ connection
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");

    // Example: declare a queue
    const queue = "test_queue";
    await channel.assertQueue(queue);
    console.log(`Queue '${queue}' is ready`);
  } catch (err) {
    console.error("RabbitMQ connection failed: ", err);
  }

  // Socket.io events
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.emit("welcome", { message: "Hello from Socket.IO server!" });
  });

  server.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

startServer();
