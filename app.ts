import * as express from "express";
import { Request, Response } from "express";
import * as http from "http";
import { logger } from "./src/utils/logger";
import * as cors from "cors";
import { config } from "dotenv";
import { tasks } from "./src/tasks/tasks.routes";
import { errorHandler } from "./src/common/errorHandler";
import { users } from "./src/users/users.routes";
import { authGuard } from "./src/guard/authGuard";
import { User } from "./src/users/types";
config();

export const app = express();

process.on("SIGTERM", () => {
  logger.info("SERVER RECEIVED SIGTERM!");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SERVER RECEIVED SIGINT!");
  process.exit(0);
});

// Enable cors
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/healthcheck", (req: Request, res: Response) => {
  res.send({ message: "Healthcheck successful" });
});

app.use("/api/users", users);

app.use(authGuard);
app.use("/api/tasks", tasks);

// Ensure errorHandler is used after all other middleware and routes
app.use(errorHandler);

const startServer = (port: string = process.env.PORT || "3000") => {
  app.set("port", port);
  logger.info(`Port in use: ${port}`);
  const server = http.createServer(app);
  server.listen(port);
  server.on("error", (error: Error) => {
    logger.error(`Error: ${error.message}`);
  });
  server.on("listening", () => {
    const addr = server.address();
    logger.info(
      `Listening on: ${typeof addr === "string" ? addr : addr?.port}`
    );
  });
  return server;
};

startServer();

declare module "express-serve-static-core" {
  export interface Request {
    auth?: Omit<User, "password">;
  }
}

