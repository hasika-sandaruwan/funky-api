import { Response } from "express";
import TemperatureLog from "../model/TemperatureLog.model";
import Notification from "../model/Notification.model";
import Freezer from "../model/Freezer.model";
import { AuthRequest } from "../middleware/auth.middleware";

/* --------------------------------
   CREATE TEMPERATURE LOG
---------------------------------*/
export const createTemperatureLog = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { freezerId, value, date } = req.body;

    if (!freezerId || value === undefined || !date) {
      return res
        .status(400)
        .json({ message: "Freezer, value and date required" });
    }

    const freezer = await Freezer.findById(freezerId);
    if (!freezer) {
      return res.status(404).json({ message: "Freezer not found" });
    }

    const user = req.user;

    const log = await TemperatureLog.create({
      freezerId: freezer._id,

      freezer: {
        id: freezer._id,
        name: freezer.name,
        icon: freezer.icon,
      },

      employeeId: user.id,

      employee: {
        id: user.id,
        name: user.name,
        email: user.email,
      },

      value,
      date,

      approved: false,
      changeStatus: false,
      changeHistory: [],
    });

    /* ---- CREATE NOTIFICATION ---- */
    await Notification.create({
      title: `${user.name} added temperature for ${freezer.name}`,
      relatedId: log._id,
      type: "temperature",
      read: false,
    });

    res.status(201).json(log);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const bulkCreateTemperatureLogs = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { logs, date } = req.body;

    if (!logs || !Array.isArray(logs) || logs.length === 0) {
      return res
        .status(400)
        .json({ message: "Logs array is required" });
    }

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const user = req.user;

    const createdLogs = [];

    for (const item of logs) {
      const { freezerId, value } = item;

      if (!freezerId || value === undefined) continue;

      const freezer = await Freezer.findById(freezerId);
      if (!freezer) continue;

      const log = await TemperatureLog.create({
        freezerId: freezer._id,

        freezer: {
          id: freezer._id,
          name: freezer.name,
          icon: freezer.icon,
        },

        employeeId: user.id,

        employee: {
          id: user.id,
          name: user.name,
          email: user.email,
        },

        value,
        date,

        approved: true,
        changeStatus: false,
        changeHistory: [],
      });

      /* Create notification */
      await Notification.create({
        title: `${user.name} added temperature for ${freezer.name}`,
        relatedId: log._id,
        type: "temperature",
        read: false,
      });

      createdLogs.push(log);
    }

    res.status(201).json({
      message: "Temperature logs saved successfully",
      count: createdLogs.length,
      data: createdLogs,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const approveTemperatureLog = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const log = await TemperatureLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    if (log.approved) {
      return res.status(400).json({
        message: "Already approved",
      });
    }

    const approver = req.user;

    log.approved = true;

    log.approvedBy = {
      id: approver._id,
      name: approver.name,
      email: approver.email,
    };

    log.approvedAt = new Date();

    log.approvalHistory.push({
      approvedBy: approver._id,
      approvedAt: new Date(),
    });

    await log.save();

    res.json({
      message: "Temperature approved successfully",
      data: log,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* --------------------------------
   UPDATE TEMPERATURE (WITH HISTORY)
---------------------------------*/
export const updateTemperatureLog = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { value } = req.body;

    const log = await TemperatureLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    log.changeHistory.push({
      value: log.value,
      changedAt: new Date(),
      changedBy: req.user.id,
    });

    log.value = value;
    log.changeStatus = true;

    await log.save();

    res.json(log);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* --------------------------------
   GET TEMPERATURE LOGS BY DATE RANGE
---------------------------------*/
export const getTemperatureLogsByDateRange = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "startDate and endDate are required",
      });
    }

    const user = req.user;

    /* -----------------------------
       BUILD DATE RANGE
    ------------------------------*/
    const start = new Date(startDate as string);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate as string);
    end.setHours(23, 59, 59, 999);

    /* -----------------------------
       BUILD FILTER
    ------------------------------*/
    const filter: any = {
      date: { $gte: start, $lte: end },
    };

    /* If employee → only own logs */
    if (user.role === "employee") {
      filter.employeeId = user._id;
    }

    /* -----------------------------
       FETCH DATA
    ------------------------------*/
    const logs = await TemperatureLog.find(filter)
      .sort({ createdAt: -1 });

    res.json({
      startDate,
      endDate,
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
   GET ALL TEMPERATURE LOGS
---------------------------------*/
export const getTemperatureLogs = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const logs = await TemperatureLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};