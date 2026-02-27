import { Router } from "express";
import {
  createUser,
  loginUser,
  requestPasswordOtp,
  changePassword,
} from "../controllers/user.controller";

const router = Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.post("/request-otp", requestPasswordOtp);
router.post("/change-password", changePassword);

export default router;