import { Router } from "express";
import {
  createWindowArea,
  getWindowAreas,
  updateWindowArea,
  deleteWindowArea,
} from "../controllers/windowArea.controller";
import {
  protect,
  managerOnly,
} from "../middleware/auth.middleware";

const router = Router();

/* GET ALL */
router.get("/", protect, getWindowAreas);

/* CREATE */
router.post("/", protect, managerOnly, createWindowArea);

/* UPDATE */
router.put("/:id", protect, managerOnly, updateWindowArea);

/* DELETE */
router.delete("/:id", protect, managerOnly, deleteWindowArea);

export default router;