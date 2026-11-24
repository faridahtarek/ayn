// Ayn: the farms routes (use case 2). Copies Lab 9's listingRoutes.js
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  handleGetMine,
  handleGetOne,
  handleCreate,
  handleUpdate,
  handleDelete,
} from "../controllers/farmController.js";

const router = express.Router();

// Every farm route needs a login: requireAuth runs first
// "/mine" comes before "/:id", or Express would read "mine" as an id
router.get("/mine", requireAuth, handleGetMine);
router.get("/:id", requireAuth, handleGetOne);
router.post("/", requireAuth, handleCreate);
router.put("/:id", requireAuth, handleUpdate);
router.delete("/:id", requireAuth, handleDelete);

export default router;
