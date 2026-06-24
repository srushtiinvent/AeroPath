import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import tripRoutes from "./routes/tripRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import profileRoutes from "./routes/profileRoutes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 5000);

// Configure CORS for GitHub Pages and local development
const allowedOrigins = [
  "http://localhost:4173",
  "http://localhost:3000",
  "http://127.0.0.1:4173",
  "https://srushtiinvent.github.io",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
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
