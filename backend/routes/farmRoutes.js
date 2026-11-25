// Ayn: the farms routes (use case 2). Copies Lab 9's listingRoutes.js
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  handleGetMine,
  handleGetOpen,
  handleGetOne,
  handleCreate,
  handleUpdate,
  handleDelete,
} from "../controllers/farmController.js";

const router = express.Router();

// Every farm route needs a login: requireAuth runs first
// "/mine" and "/open" come before "/:id", or Express would read them as an id
router.get("/mine", requireAuth, handleGetMine);
router.get("/open", requireAuth, handleGetOpen); // use case 3: companies only
router.get("/:id", requireAuth, handleGetOne);
router.post("/", requireAuth, handleCreate);
router.put("/:id", requireAuth, handleUpdate);
router.delete("/:id", requireAuth, handleDelete);

export default router;
