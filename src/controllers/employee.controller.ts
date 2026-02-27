import { Request, Response } from "express";
import Staff from "../model/Employee.model";
import { createSystemUser } from "../controllers/user.controller";
/* ---------------------------
   CREATE STAFF
----------------------------*/
export const createStaff = async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber, role, employmentType } =
      req.body;

    // Check if staff already exists
    const exists = await Staff.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    // 1️⃣ Create staff record
    const staff = await Staff.create({
      name,
      email,
      phoneNumber,
      role,
      employmentType,
    });

    // 2️⃣ Create system user account
    const { plainPassword } = await createSystemUser(
      name,
      email,
      role
    );

    res.status(201).json({
      message: "Staff and user account created successfully",
      staff,
      loginCredentials: {
        email,
        password: plainPassword, // send once (or email it instead)
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   GET ALL (Pagination)
   ?page=1&limit=10
----------------------------*/
export const getStaff = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await Staff.countDocuments();

    const staff = await Staff.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      data: staff,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   GET BY ID
----------------------------*/
export const getStaffById = async (
  req: Request,
  res: Response
) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff)
      return res.status(404).json({ message: "Not found" });

    res.json(staff);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   UPDATE
----------------------------*/
export const updateStaff = async (
  req: Request,
  res: Response
) => {
  try {
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!staff)
      return res.status(404).json({ message: "Not found" });

    res.json(staff);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------
   DELETE
----------------------------*/
export const deleteStaff = async (
  req: Request,
  res: Response
) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff)
      return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};