import mongoose, { Document, Schema } from "mongoose";

export interface IBin extends Document {
  name: string;
  icon: string;
}

const binSchema = new Schema<IBin>(
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

export default mongoose.model<IBin>("Bin", binSchema);