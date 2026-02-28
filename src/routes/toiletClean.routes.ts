import { Router } from "express";
import { protect, allowRoles } from "../middleware/auth.middleware";
import { uploadToiletImages } from "../middleware/upload.middleware";
import { createToiletCleanLog, getToiletLogsByRange, deleteAllToiletHistory, approveToiletLog } from "../controllers/toiletClean.controller";

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

router.get(
  "/range",
  protect,
  allowRoles("employee", "supervisor", "manager"),
  getToiletLogsByRange
);

router.put(
  "/:id/approve",
  protect,
  allowRoles("supervisor", "manager"),
  approveToiletLog
);

router.delete(
  "/delete-all-history",
  protect,
  allowRoles("employee", "supervisor", "manager"),
  deleteAllToiletHistory
);

export default router;