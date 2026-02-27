import { Request, Response } from "express";
import Toilet from "../model/Toilet.model";

/* ---------------------------
   CREATE TOILET
----------------------------*/
export const createToilet = async (
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

    const toilet = await Toilet.create({ name, icon });

    res.status(201).json(toilet);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   GET ALL TOILETS
----------------------------*/
export const getToilets = async (
  _req: Request,
  res: Response
) => {
  try {
    const toilets = await Toilet.find().sort({
      createdAt: -1,
    });

    res.json(toilets);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   UPDATE TOILET
----------------------------*/
export const updateToilet = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, icon } = req.body;

    const toilet = await Toilet.findByIdAndUpdate(
      req.params.id,
      { name, icon },
      { new: true }
    );

    if (!toilet) {
      return res
        .status(404)
        .json({ message: "Toilet not found" });
    }

    res.json(toilet);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   DELETE TOILET
----------------------------*/
export const deleteToilet = async (
  req: Request,
  res: Response
) => {
  try {
    const toilet = await Toilet.findByIdAndDelete(
      req.params.id
    );

    if (!toilet) {
      return res
        .status(404)
        .json({ message: "Toilet not found" });
    }

    res.json({ message: "Toilet deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};