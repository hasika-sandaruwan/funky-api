import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../model/User.model";

export interface AuthRequest extends Request {
  user?: any;
}

/* =========================================================
   PROTECT - VERIFY TOKEN + LOAD REAL USER FROM DATABASE
========================================================= */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    // 🔥 Fetch real user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* =========================================================
   MANAGER ONLY ACCESS
========================================================= */
export const managerOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "manager") {
    return res.status(403).json({
      message: "Manager access only",
    });
  }

  next();
};

/* =========================================================
   FLEXIBLE ROLE-BASED ACCESS CONTROL
   Usage:
   allowRoles("employee", "supervisor", "manager")
========================================================= */
export const allowRoles =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };