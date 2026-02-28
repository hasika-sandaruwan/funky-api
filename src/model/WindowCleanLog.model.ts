import mongoose, { Document, Schema } from "mongoose";

export interface IWindowCleanLog extends Document {
  windowAreaId: mongoose.Types.ObjectId;

  windowArea: {
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

  cleaned: boolean;

  date: Date;

  approved: boolean;

  approvedBy?: {
    id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  };

  approvedAt?: Date;

  changeStatus: boolean;

  changeHistory: {
    cleaned: boolean;
    changedAt: Date;
    changedBy: mongoose.Types.ObjectId;
  }[];

  approvalHistory: {
    approvedBy: mongoose.Types.ObjectId;
    approvedAt: Date;
  }[];
}

const windowCleanLogSchema = new Schema<IWindowCleanLog>(
  {
    windowAreaId: {
      type: Schema.Types.ObjectId,
      ref: "WindowArea",
      required: true,
    },

    windowArea: {
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

    cleaned: {
      type: Boolean,
      required: true,
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

    changeStatus: {
      type: Boolean,
      default: false,
    },

    changeHistory: [
      {
        cleaned: Boolean,
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    approvalHistory: [
      {
        approvedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        approvedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IWindowCleanLog>(
  "WindowCleanLog",
  windowCleanLogSchema
);