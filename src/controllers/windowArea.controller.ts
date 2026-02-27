import { Request, Response } from "express";
import WindowArea from "../model/WindowArea.model";

/* ---------------------------
   CREATE WINDOW AREA
----------------------------*/
export const createWindowArea = async (
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

    const area = await WindowArea.create({ name, icon });

    res.status(201).json(area);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   GET ALL WINDOW AREAS
----------------------------*/
export const getWindowAreas = async (
  _req: Request,
  res: Response
) => {
  try {
    const areas = await WindowArea.find().sort({
      createdAt: -1,
    });

    res.json(areas);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   UPDATE WINDOW AREA
----------------------------*/
export const updateWindowArea = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, icon } = req.body;

    const area = await WindowArea.findByIdAndUpdate(
      req.params.id,
      { name, icon },
      { new: true }
    );

    if (!area) {
      return res
        .status(404)
        .json({ message: "Window area not found" });
    }

    res.json(area);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   DELETE WINDOW AREA
----------------------------*/
export const deleteWindowArea = async (
  req: Request,
  res: Response
) => {
  try {
    const area = await WindowArea.findByIdAndDelete(
      req.params.id
    );

    if (!area) {
      return res
        .status(404)
        .json({ message: "Window area not found" });
    }

    res.json({ message: "Window area deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};