// Full-stack Express server with API routes and Vite middleware
import express from "express";
import { createServer } from "http";
import { setupVite, log } from "./vite";
import { registerRoutes } from "./routes";
import { initializeDatabase } from "./db";

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes first (before Vite middleware)
registerRoutes(app);

// Initialize database
try {
  await initializeDatabase();
  log("Database initialized successfully");
} catch (error) {
  log(`Database initialization failed: ${error}`, "database");
  process.exit(1);
}

// Setup Vite in development
if (process.env.NODE_ENV === "development") {
  await setupVite(app, server);
  log("Vite dev middleware setup complete");
}

const port = parseInt(process.env.PORT || "5000", 10);

server.listen(port, "0.0.0.0", () => {
  log(`Server running at http://0.0.0.0:${port}`);
  if (process.env.NODE_ENV === "development") {
    log("Frontend and API server ready");
  }
});