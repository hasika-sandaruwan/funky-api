import { Router } from "express";
import { protect, allowRoles } from "../middleware/auth.middleware";
import {
  createWindowCleanLog,
  updateWindowCleanLog,
  getWindowCleanLogsByDate,
  deleteAllWindowHistory,
} from "../controllers/windowClean.controller";

const router = Router();

router.post("/", protect, createWindowCleanLog);
router.put("/:id", protect, updateWindowCleanLog);
router.get(
  "/range",
  protect,
  allowRoles("employee", "supervisor", "manager"),
  getWindowCleanLogsByDate
);
router.delete(
  "/delete-all-history",
  protect,
  allowRoles("manager", "supervisor"),
  deleteAllWindowHistory
);

export default router;