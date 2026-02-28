import { Response } from "express";
import WindowArea from "../model/WindowArea.model";
import WindowCleanLog from "../model/WindowCleanLog.model";
import Notification from "../model/Notification.model";
import { AuthRequest } from "../middleware/auth.middleware";

/* -----------------------------
   CREATE WINDOW CLEAN LOG
------------------------------ */
export const createWindowCleanLog = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { logs } = req.body;

    if (!logs || !Array.isArray(logs) || logs.length === 0) {
      return res.status(400).json({ message: "Logs array required" });
    }

    const user = req.user;
    const userId = user.id || user._id;

    const createdLogs = [];

    for (const item of logs) {
      const { windowAreaId, cleaned, date } = item;

      if (!windowAreaId) continue;

      const windowArea = await WindowArea.findById(windowAreaId);
      if (!windowArea) continue;

      const log = await WindowCleanLog.create({
        windowAreaId: windowArea._id,

        windowArea: {
          id: windowArea._id,
          name: windowArea.name,
          icon: windowArea.icon,
        },

        employeeId: userId,

        employee: {
          id: userId,
          name: user.name,
          email: user.email,
        },

        cleaned: Boolean(cleaned),
        date: date ? new Date(date) : new Date(),

        approved: false,
        changeStatus: false,
      });

      await Notification.create({
        title: `${user.name} cleaned ${windowArea.name}`,
        relatedId: log._id,
        type: "window",
        read: false,
      });

      createdLogs.push(log);
    }

    res.status(201).json({
      message: "Window cleaning logs created successfully",
      count: createdLogs.length,
      data: createdLogs,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const updateWindowCleanLog = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { cleaned } = req.body;

    const log = await WindowCleanLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    log.changeStatus = true;

    log.changeHistory.push({
      cleaned,
      changedAt: new Date(),
      changedBy: req.user.id || req.user._id,
    });

    log.cleaned = cleaned;
    log.approved = false;

    await log.save();

    res.json(log);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
/* --------------------------------
   GET WINDOW LOGS BY DATE RANGE
---------------------------------*/
export const getWindowCleanLogsByDate = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { startDate, endDate, history } = req.query;

    const user = req.user;
    const userId = user._id;

    let filter: any = {};

    /* -----------------------------
       HISTORY MODE → LOAD ALL
    ------------------------------ */
    if (history === "true") {
      // managers & supervisors see all
      if (user.role === "employee") {
        filter.employeeId = userId;
      }

      const logs = await WindowCleanLog.find(filter)
        .sort({ createdAt: -1 });

      return res.json({
        count: logs.length,
        data: logs,
      });
    }

    /* -----------------------------
       DATE RANGE MODE
    ------------------------------ */
    if (!startDate) {
      return res.status(400).json({
        message: "startDate required",
      });
    }

    const start = new Date(startDate as string);
    start.setHours(0, 0, 0, 0);

    const end = endDate
      ? new Date(endDate as string)
      : new Date(startDate as string);

    end.setHours(23, 59, 59, 999);

    filter.date = { $gte: start, $lte: end };

    if (user.role === "employee") {
      filter.employeeId = userId;
    }

    const logs = await WindowCleanLog.find(filter)
      .sort({ createdAt: -1 });

    res.json({
      count: logs.length,
      data: logs,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
/* --------------------------------
   DELETE ALL WINDOW CLEAN HISTORY
---------------------------------*/
export const deleteAllWindowHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = req.user;

    if (
      user.role !== "manager" &&
      user.role !== "supervisor"
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const result = await WindowCleanLog.deleteMany({});

    res.json({
      message: "All window clean history deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};