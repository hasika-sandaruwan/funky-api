import { Response } from "express";
import Toilet from "../model/Toilet.model";
import ToiletCleanLog from "../model/ToiletCleanLog.model";
import Notification from "../model/Notification.model";
import { AuthRequest } from "../middleware/auth.middleware";

export const createToiletCleanLog = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { toiletId, date, comment } = req.body;
    console.log(req.body);

    const toilet = await Toilet.findById(toiletId);
    if (!toilet) {
      return res.status(404).json({ message: "Toilet not found" });
    }

    if (comment && comment.length > 1000) {
      return res
        .status(400)
        .json({ message: "Comment max 1000 characters" });
    }

    const images =
      req.files?.map(
        (file: any) => `/uploads/toilets/${file.filename}`
      ) || [];

    const user = req.user;

    const log = await ToiletCleanLog.create({
      toiletId: toilet._id,

      toilet: {
        id: toilet._id,
        name: toilet.name,
        icon: toilet.icon,
      },

      employeeId: user._id,

      employee: {
        id: user._id,
        name: user.name,
        email: user.email,
      },

      date,
      images,
      comment,

      approved: false,
      changeStatus: false,
      changeHistory: [],
      approvalHistory: [],
    });

    await Notification.create({
      title: `${user.name} cleaned ${toilet.name}`,
      relatedId: log._id,
      type: "toilet",
      read: false,
    });

    res.status(201).json(log);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/toilet-clean/range
export const getToiletLogsByRange = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = req.user;
    const { startDate, endDate, history } = req.query;

    let filter: any = {};


    // 🔥 ROLE LOGIC
    if (user.role === "employee") {
      filter.employeeId = user._id;
    }

    // HISTORY MODE (return all reviewed)
    if (history === "true") {
      filter.approved = true;
    } else {
      if (!startDate) {
        return res.status(400).json({
          message: "startDate required",
        });
      }

      const start = new Date(startDate as string);
      const end = new Date(
        (endDate as string) || (startDate as string)
      );

      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);

      filter.date = {
        $gte: start,
        $lte: end,
      };
    }

    const logs = await ToiletCleanLog.find(filter)
      .sort({ createdAt: -1 });

    res.json({ data: logs });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// APPROVE TOILET CLEAN LOG
export const approveToiletLog = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const log = await ToiletCleanLog.findById(
      req.params.id
    );

    if (!log) {
      return res
        .status(404)
        .json({ message: "Log not found" });
    }

    log.approved = true;
    log.approvedBy = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    };

    log.approvedAt = new Date();

    log.approvalHistory.push({
      approvedBy: req.user._id,
      approvedAt: new Date(),
    });

    await log.save();

    res.json(log);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteAllToiletHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = req.user;

    let filter: any = {};

    if (user.role === "employee") {
      filter.employeeId = user._id;
    }

    await ToiletCleanLog.deleteMany(filter);

    res.json({
      message: "All toilet history cleared",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};