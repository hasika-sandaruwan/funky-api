import { Router } from "express";
import { protect, allowRoles  } from "../middleware/auth.middleware";
import { getTodayLogs, getAllTodayLogs } from "../controllers/todayLogs.controller";

const router = Router();

router.get("/", protect, getTodayLogs);
router.get(
  "/all",
  protect,
  allowRoles("manager", "supervisor"),
  getAllTodayLogs
);

export default router;