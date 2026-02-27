import { Router } from "express";
import {
  createBin,
  getBins,
  updateBin,
  deleteBin,
} from "../controllers/bin.controller";
import {
  protect,
  managerOnly,
} from "../middleware/auth.middleware";

const router = Router();

/* GET ALL */
router.get("/", protect, getBins);

/* CREATE */
router.post("/", protect, managerOnly, createBin);

/* UPDATE */
router.put("/:id", protect, managerOnly, updateBin);

/* DELETE */
router.delete("/:id", protect, managerOnly, deleteBin);

export default router;