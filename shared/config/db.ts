// shared/config/db.ts
import "./dotenv-loader.ts";
import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env");
}

// Ensure PrismaClient is a singleton in dev (prevents hot-reload issues)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Optional: connect on import (can be removed if lazy loading)
(async () => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected - ✅");
  } catch (err) {
    console.error("PostgreSQL connection error:", err);
    process.exit(1);
  }
})();
