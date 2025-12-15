import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./services/database.js";
import regionsRouter from "./routes/regions.js";
import activitiesRouter from "./routes/activities.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Kauai Travel Helper API",
    version: "1.3.1",
    status: "Stable Release",
    endpoints: {
      regions: "/api/regions",
      regionActivities: "/api/regions/:region/activities",
      activityDetails: "/api/activities/:id",
      activityLiveStatus: "/api/activities/:id/live-status",
    },
  });
});

app.use("/api/regions", regionsRouter);
app.use("/api/activities", activitiesRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log("✓ Database initialized");

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
