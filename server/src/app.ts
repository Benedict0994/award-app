import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes";
import candidateRoutes from "./routes/candidateRoutes";
import settingsRoutes from "./routes/SettingsRoutes";
import { env } from "./config/env";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/", (_req, res) => {
  res.send("Voting API is running");
});

export default app;
