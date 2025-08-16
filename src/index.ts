import http from "http"; // builtin first

import { config } from "dotenv"; // external next

config();

import app from "./app"; // internal after externals
import logger from "./core/config/logger";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});
