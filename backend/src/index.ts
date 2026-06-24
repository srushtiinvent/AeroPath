import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import tripRoutes from "./routes/tripRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import profileRoutes from "./routes/profileRoutes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/profile", profileRoutes);

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "AeroPath Backend" });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found." });
});

app.use((error: unknown, _req: Request, res: Response) => {
  console.error("Unexpected server error:", error);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(port, () => {
  console.log(`AeroPath backend listening on http://localhost:${port}`);
});
