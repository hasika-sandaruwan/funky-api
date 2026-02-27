import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/User.model";
import Otp from "../model/Otp.model";

/* ------------------------
   HELPER: Generate JWT
-------------------------*/
const generateToken = (userId: string, role: string) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

/* ------------------------
   CREATE USER (No OTP)
-------------------------*/
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const createSystemUser = async (
  name: string,
  email: string,
  role: string,
  password?: string
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User email already registered");
  }

  const generatedPassword = password || "123456"; // or generate random

  const hashedPassword = await bcrypt.hash(generatedPassword, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return {
    user,
    plainPassword: generatedPassword,
  };
};

/* ------------------------
   LOGIN (Returns JWT)
-------------------------*/
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------------
   REQUEST OTP
-------------------------*/
export const requestPasswordOtp = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email }); // remove old OTP

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log("OTP:", otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------------
   CHANGE PASSWORD (OTP REQUIRED)
   RETURNS JWT AFTER SUCCESS
-------------------------*/
export const changePassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord)
      return res.status(400).json({ message: "Invalid OTP" });

    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ message: "User not found" });

    await Otp.deleteMany({ email });

    // 🔐 Generate JWT after password reset
    const token = generateToken(user._id.toString(), user.role);

    res.json({
      message: "Password changed successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};