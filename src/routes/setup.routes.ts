import { Router } from "express";
import { getSetupSummary } from "../controllers/setup.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/summary", protect, getSetupSummary);

export default router;