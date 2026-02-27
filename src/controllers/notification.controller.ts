import { Request, Response } from "express";
import Notification from "../model/Notification.model";

/* ---------------------------
   GET USER NOTIFICATIONS
----------------------------*/
export const getNotifications = async (
  req: any,
  res: Response
) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   MARK SINGLE AS READ
----------------------------*/
export const markAsRead = async (
  req: any,
  res: Response
) => {
  try {
    const notification =
      await Notification.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true }
      );

    if (!notification) {
      return res
        .status(404)
        .json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   MARK ALL AS READ
----------------------------*/
export const markAllAsRead = async (
  req: any,
  res: Response
) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    res.json({ message: "All marked as read" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};