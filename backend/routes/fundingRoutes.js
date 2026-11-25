// Ayn: the fundings routes (use case 3). Copies Lab 9's listingRoutes.js, like farmRoutes.js
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  handleGetMine,
  handleCreate,
  handleUpdate,
  handleDelete,
} from "../controllers/fundingController.js";

const router = express.Router();

// Every funding route needs a login: requireAuth runs first
router.get("/mine", requireAuth, handleGetMine);
router.post("/", requireAuth, handleCreate);
router.put("/:id", requireAuth, handleUpdate); // change the reward
router.delete("/:id", requireAuth, handleDelete); // withdraw

export default router;
