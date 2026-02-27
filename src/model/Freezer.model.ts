import mongoose, { Document, Schema } from "mongoose";

export interface IFreezer extends Document {
  name: string;
  icon: string;
}

const freezerSchema = new Schema<IFreezer>(
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

export default mongoose.model<IFreezer>("Freezer", freezerSchema);