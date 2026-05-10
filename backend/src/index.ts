import "dotenv/config";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";

import connectDB from "./config/db";
import { responseHandler } from "./middleware/responseHandler";
import { globalErrorHandler } from "./middleware/errorMiddleware";
import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chat.routes";
import { initSocket } from "./lib/socket";

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

initSocket(httpServer);

connectDB();

// ─── Security ─────────────────────────────────────────────────────────────────

app.use(helmet());
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
    credentials: true,
  })
);

// ─── Rate Limiters ────────────────────────────────────────────────────────────

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "failed", message: "Too many requests. Please try again later." },
});

// Strict limiter for auth mutation routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "failed", message: "Too many attempts. Please wait 15 minutes." },
});

// Very strict limiter for OTP (prevents brute force on 6-digit code)
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "failed", message: "Too many OTP attempts. Please request a new code." },
});

// ─── Body Parsing ─────────────────────────────────────────────────────────────

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(responseHandler);

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/api/auth/sign-in", authLimiter);
app.use("/api/auth/sign-up", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/auth/verify-otp", otpLimiter);
app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Error Handling ───────────────────────────────────────────────────────────

app.use(globalErrorHandler);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} [${process.env.NODE_ENV}]`);
});

export default app;
