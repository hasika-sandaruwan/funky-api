import mongoose, { Document, Schema } from "mongoose";

export interface IToilet extends Document {
  name: string;
  icon: string;
}

const toiletSchema = new Schema<IToilet>(
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

export default mongoose.model<IToilet>(
  "Toilet",
  toiletSchema
);