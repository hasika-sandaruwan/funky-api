import { Router } from "express";
import {
  createStaff,
  getStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} from "../controllers/employee.controller";
import {
  protect,
  managerOnly,
} from "../middleware/auth.middleware";

const router = Router();

router.get("/", protect, getStaff);
router.get("/:id", protect, getStaffById);

router.post("/", protect, managerOnly, createStaff);
router.put("/:id", protect, managerOnly, updateStaff);
router.delete("/:id", protect, managerOnly, deleteStaff);

export default router;