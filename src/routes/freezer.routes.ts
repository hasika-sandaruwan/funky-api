import { Router } from "express";
import {
  createFreezer,
  getFreezers,
  updateFreezer,
  deleteFreezer,
} from "../controllers/freezer.controller";
import { protect, managerOnly } from "../middleware/auth.middleware";

const router = Router();

/* GET ALL */
router.get("/", protect, getFreezers);

/* CREATE */
router.post("/", protect, managerOnly, createFreezer);

/* UPDATE */
router.put("/:id", protect, managerOnly, updateFreezer);

/* DELETE */
router.delete("/:id", protect, managerOnly, deleteFreezer);

export default router;