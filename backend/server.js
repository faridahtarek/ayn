// Ayn: the API (Lab 9: with users)
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import farmRoutes from "./routes/farmRoutes.js";
import fundingRoutes from "./routes/fundingRoutes.js";
import proofRoutes from "./routes/proofRoutes.js";

const app = express();

// ========== MIDDLEWARE ==========
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use(express.json());
// Let our React app, on another port, read our answers
app.use(cors());

// ========== ROUTES ==========
app.get("/", (req, res) => {
  res.send("Welcome to Ayn");
});
// Is the API up? Every project has this route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});
app.use("/api/auth", authRoutes);
app.use("/api/farms", farmRoutes);
app.use("/api/fundings", fundingRoutes);
app.use("/api/proofs", proofRoutes); // use case 4

// ========== START ==========
await connectDB();
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
