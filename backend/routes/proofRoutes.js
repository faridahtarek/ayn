// Ayn: the proofs routes (use case 4). Copies Lab 9's listingRoutes.js, like farmRoutes.js
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  handleGetMine,
  handleCreate,
  handleUpdate,
  handleDelete,
} from "../controllers/proofController.js";

const router = express.Router();

// Every proof route needs a login: requireAuth runs first
router.get("/mine", requireAuth, handleGetMine);
router.post("/", requireAuth, handleCreate);
router.put("/:id", requireAuth, handleUpdate); // edit, e.g. after a rejection
router.delete("/:id", requireAuth, handleDelete); // before the company reviews it

export default router;
