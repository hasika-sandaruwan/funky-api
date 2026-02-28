import mongoose, { Document, Schema } from "mongoose";

export interface IBinRemovalLog extends Document {
  binId: mongoose.Types.ObjectId;

  bin: {
    id: mongoose.Types.ObjectId;
    name: string;
    icon: string;
  };

  employeeId: mongoose.Types.ObjectId;

  employee: {
    id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  };

  date: Date;

  approved: boolean;

  approvedBy?: {
    id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  };

  approvedAt?: Date;
}

const binRemovalSchema = new Schema<IBinRemovalLog>(
  {
    binId: {
      type: Schema.Types.ObjectId,
      ref: "Bin",
      required: true,
    },

    bin: {
      id: { type: Schema.Types.ObjectId, required: true },
      name: String,
      icon: String,
    },

    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    employee: {
      id: { type: Schema.Types.ObjectId, required: true },
      name: String,
      email: String,
    },

    date: {
      type: Date,
      required: true,
    },

    approved: {
      type: Boolean,
      default: false,
    },

    approvedBy: {
      id: Schema.Types.ObjectId,
      name: String,
      email: String,
    },

    approvedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model<IBinRemovalLog>(
  "BinRemovalLog",
  binRemovalSchema
);