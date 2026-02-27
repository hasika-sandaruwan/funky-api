import mongoose, { Document, Schema } from "mongoose";

export interface IWindowArea extends Document {
  name: string;
  icon: string;
}

const windowAreaSchema = new Schema<IWindowArea>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IWindowArea>(
  "WindowArea",
  windowAreaSchema
);