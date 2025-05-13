import express from "express";
import process from "process";
import distributeRouter from "./routes/distribute";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Mount routes
app.use("/api", distributeRouter);

// Root route
app.get("/", (_, res) => {
  res.json({ message: "Welcome to the TypeScript Node.js server!" });
});

// Health check
app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

// 404 fallback
app.use(/.*/, (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
