import express from "express";
import { Request, Response } from "express";
import rocketsRouter from "./rockets.js";
import logger from "./utils/logger.js";

const app = express();
const port = Number(process.env.PORT ?? "3000");
const isTestEnvironment = process.env.NODE_ENV === "test";

app.use(express.json());
app.use("/api/rockets", rocketsRouter);

app.get("/health", (_req: Request, res: Response): void => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

if (!isTestEnvironment) {
  app.listen(port, () => {
    logger.log("server", `AstroBookingUcj API is running on http://localhost:${port}`);
    logger.log("server", `Health endpoint available at http://localhost:${port}/health`);
  });
}

export default app;
export { app, port };
