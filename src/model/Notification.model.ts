import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  title: string;
  relatedId: mongoose.Types.ObjectId;
  type: string;
  read: boolean;
}

const notificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    relatedId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    type: {
      type: String,
      enum: ["temperature","toilet","bin","window"],
      required: true,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema
);