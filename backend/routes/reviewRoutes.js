// Ayn: the reviews routes (use case 5). Copies Lab 9's listingRoutes.js, like proofRoutes.js
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { handleGetMine, handleReview } from "../controllers/reviewController.js";

const router = express.Router();

// Every review route needs a login: requireAuth runs first (companies only)
router.get("/", requireAuth, handleGetMine);
router.put("/:id", requireAuth, handleReview); // confirm or reject, with a note

export default router;
