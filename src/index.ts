import express from "express";
import { Request, Response } from "express";
import rocketsRouter from "./rockets.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());
app.use("/api/rockets", rocketsRouter);

app.get("/health", (_req: Request, res: Response): void => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`AstroBookingUcj API is running on http://localhost:${port}`);
    console.log(`Health endpoint available at http://localhost:${port}/health`);
  });
}

export default app;
export { app, port };
