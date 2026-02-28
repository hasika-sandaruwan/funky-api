import { Router } from "express";
import { protect, allowRoles } from "../middleware/auth.middleware";
import { createBinRemoval, getTodayBinRemovals, getBinRemovalsByRange, deleteAllBinHistory } from "../controllers/binRemoval.controller";

const router = Router();

router.post("/", protect, createBinRemoval);
router.get("/today", protect, getTodayBinRemovals);
router.get(
  "/range",
  protect,
  allowRoles("employee", "supervisor", "manager"),
  getBinRemovalsByRange
);

router.delete(
  "/delete-all-history",
  protect,
  allowRoles("employee", "supervisor", "manager"),
  deleteAllBinHistory
);

export default router;