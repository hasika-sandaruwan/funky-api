import { Request, Response } from "express";
import Bin from "../model/Bin.model";

/* ---------------------------
   CREATE BIN
----------------------------*/
export const createBin = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, icon } = req.body;

    if (!name || !icon) {
      return res
        .status(400)
        .json({ message: "Name and icon are required" });
    }

    const bin = await Bin.create({ name, icon });

    res.status(201).json(bin);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   GET ALL BINS
----------------------------*/
export const getBins = async (
  _req: Request,
  res: Response
) => {
  try {
    const bins = await Bin.find().sort({
      createdAt: -1,
    });

    res.json(bins);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   UPDATE BIN
----------------------------*/
export const updateBin = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, icon } = req.body;

    const bin = await Bin.findByIdAndUpdate(
      req.params.id,
      { name, icon },
      { new: true }
    );

    if (!bin) {
      return res
        .status(404)
        .json({ message: "Bin not found" });
    }

    res.json(bin);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   DELETE BIN
----------------------------*/
export const deleteBin = async (
  req: Request,
  res: Response
) => {
  try {
    const bin = await Bin.findByIdAndDelete(
      req.params.id
    );

    if (!bin) {
      return res
        .status(404)
        .json({ message: "Bin not found" });
    }

    res.json({ message: "Bin deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};