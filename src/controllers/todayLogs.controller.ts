import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import BinRemovalLog from "../model/BinRemovalLog.model";
import TemperatureLog from "../model/TemperatureLog.model";
import WindowCleanLog from "../model/WindowCleanLog.model";
import ToiletCleanLog from "../model/ToiletCleanLog.model";
import { log } from "node:console";

/* =========================================================
   GET ALL TODAY LOGS FOR LOGGED-IN USER
========================================================= */
export const getTodayLogs = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = req.user;
    const userId = user._id;
console.log(req.user);

    /* -------------------------
       GET TODAY RANGE
    -------------------------- */
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    /* -------------------------
       FETCH ALL LOGS IN PARALLEL
    -------------------------- */
    const [
      binLogs,
      temperatureLogs,
      windowLogs,
      toiletLogs,
    ] = await Promise.all([
      BinRemovalLog.find({
        employeeId: userId,
        date: { $gte: startOfDay, $lte: endOfDay },
      }).sort({ createdAt: -1 }),

      TemperatureLog.find({
        employeeId: userId,
        date: { $gte: startOfDay, $lte: endOfDay },
      }).sort({ createdAt: -1 }),

      WindowCleanLog.find({
        employeeId: userId,
        date: { $gte: startOfDay, $lte: endOfDay },
      }).sort({ createdAt: -1 }),

      ToiletCleanLog.find({
        employeeId: userId,
        date: { $gte: startOfDay, $lte: endOfDay },
      }).sort({ createdAt: -1 }),
    ]);

    /* -------------------------
       RETURN RESPONSE
    -------------------------- */


    res.json({
      date: new Date(),
      counts: {
        bins: binLogs.length,
        temperatures: temperatureLogs.length,
        windows: windowLogs.length,
        toilets: toiletLogs.length,
      },
      data: {
        bins: binLogs,
        temperatures: temperatureLogs,
        windows: windowLogs,
        toilets: toiletLogs,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};


/* =========================================================
   GET ALL TODAY LOGS (MANAGER / SUPERVISOR)
========================================================= */
export const getAllTodayLogs = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = req.user;

    /* Only manager or supervisor allowed */
    if (
      user.role !== "manager" &&
      user.role !== "supervisor"
    ) {
      return res
        .status(403)
        .json({ message: "Access denied" });
    }

    /* -------------------------
       GET TODAY RANGE
    -------------------------- */
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    /* -------------------------
       FETCH ALL LOGS (NO USER FILTER)
    -------------------------- */
    const [
      binLogs,
      temperatureLogs,
      windowLogs,
      toiletLogs,
    ] = await Promise.all([
      BinRemovalLog.find({
        date: { $gte: startOfDay, $lte: endOfDay },
      }).sort({ createdAt: -1 }),

      TemperatureLog.find({
        date: { $gte: startOfDay, $lte: endOfDay },
      }).sort({ createdAt: -1 }),

      WindowCleanLog.find({
        date: { $gte: startOfDay, $lte: endOfDay },
      }).sort({ createdAt: -1 }),

      ToiletCleanLog.find({
        date: { $gte: startOfDay, $lte: endOfDay },
      }).sort({ createdAt: -1 }),
    ]);

    res.json({
      date: new Date(),
      counts: {
        bins: binLogs.length,
        temperatures: temperatureLogs.length,
        windows: windowLogs.length,
        toilets: toiletLogs.length,
      },
      data: {
        bins: binLogs,
        temperatures: temperatureLogs,
        windows: windowLogs,
        toilets: toiletLogs,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};