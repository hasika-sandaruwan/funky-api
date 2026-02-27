import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { uploadToiletImages } from "../middleware/upload.middleware";
import { createToiletCleanLog } from "../controllers/toiletClean.controller";

const router = Router();

/* -----------------------------
   TEST ROUTE (NO AUTH)
------------------------------ */
router.get("/test-public", (req, res) => {
  res.json({
    success: true,
    message: "Toilet Clean API is working 🚀",
  });
});

/* -----------------------------
   TEST ROUTE WITH AUTH
------------------------------ */
router.get("/test", (req: any, res) => {
  res.json({
    success: true,
    message: "Protected route working ✅",
    user: req.user,
  });
});

/* -----------------------------
   CREATE CLEAN LOG
------------------------------ */
router.post(
  "/",
  protect,
  uploadToiletImages.array("images", 10),
  createToiletCleanLog
);

export default router;