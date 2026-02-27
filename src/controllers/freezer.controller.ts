import { Request, Response } from "express";
import Freezer from "../model/Freezer.model";

/* ---------------------------
   CREATE FREEZER
----------------------------*/
export const createFreezer = async (req: Request, res: Response) => {
  try {
    const { name, icon } = req.body;

    if (!name || !icon) {
      return res.status(400).json({ message: "Name and icon are required" });
    }

    const freezer = await Freezer.create({ name, icon });

    res.status(201).json(freezer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   GET ALL FREEZERS
----------------------------*/
export const getFreezers = async (_req: Request, res: Response) => {
  try {
    const freezers = await Freezer.find().sort({ createdAt: -1 });
    res.json(freezers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   UPDATE FREEZER
----------------------------*/
export const updateFreezer = async (req: Request, res: Response) => {
  try {
    const { name, icon } = req.body;

    const freezer = await Freezer.findByIdAndUpdate(
      req.params.id,
      { name, icon },
      { new: true }
    );

    if (!freezer) {
      return res.status(404).json({ message: "Freezer not found" });
    }

    res.json(freezer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   DELETE FREEZER
----------------------------*/
export const deleteFreezer = async (req: Request, res: Response) => {
  try {
    const freezer = await Freezer.findByIdAndDelete(req.params.id);

    if (!freezer) {
      return res.status(404).json({ message: "Freezer not found" });
    }

    res.json({ message: "Freezer deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};