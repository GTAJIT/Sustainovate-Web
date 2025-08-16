import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// import { errorMiddleware } from "./core/middlewares/error.middleware";
import routes from "./routes"; // centralized route loader

const app: Application = express();

// --- Global middlewares ---
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// --- API routes ---
app.use("/api", routes);

// --- Health check route ---
app.get("/health", (_, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// --- Centralized error handling ---
// app.use(errorMiddleware);

export default app;
