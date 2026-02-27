import { Router } from "express";
import {
  createToilet,
  getToilets,
  updateToilet,
  deleteToilet,
} from "../controllers/toilet.controller";
import {
  protect,
  managerOnly,
} from "../middleware/auth.middleware";

const router = Router();

/* GET ALL */
router.get("/", protect, getToilets);

/* CREATE */
router.post("/", protect, managerOnly, createToilet);

/* UPDATE */
router.put("/:id", protect, managerOnly, updateToilet);

/* DELETE */
router.delete("/:id", protect, managerOnly, deleteToilet);

export default router;