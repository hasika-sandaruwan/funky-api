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