import mongoose, { Document, Schema } from "mongoose";

export type StaffRole = "manager" | "supervisor" | "employee";
export type EmploymentType = "full-time" | "part-time" | "contract";

export interface IStaff extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  role: StaffRole;
  employmentType: EmploymentType;
}

const staffSchema = new Schema<IStaff>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    role: {
      type: String,
      enum: ["manager", "supervisor", "employee"],
      required: true,
    },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IStaff>("Staff", staffSchema);