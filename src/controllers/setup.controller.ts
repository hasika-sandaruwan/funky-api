import { Request, Response } from "express";
import Freezer from "../model/Freezer.model";
import WindowArea from "../model/WindowArea.model";
import Toilet from "../model/Toilet.model";
import Bin from "../model/Bin.model";

export const getSetupSummary = async (
  _req: Request,
  res: Response
) => {
  try {
    const [freezers, windows, toilets, bins] =
      await Promise.all([
        Freezer.find().sort({ createdAt: -1 }),
        WindowArea.find().sort({ createdAt: -1 }),
        Toilet.find().sort({ createdAt: -1 }),
        Bin.find().sort({ createdAt: -1 }),
      ]);

    res.json({
      freezers,
      windows,
      toilets,
      bins,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};