import mongoose, { Document, Schema } from "mongoose";

export interface ITemperatureLog extends Document {
  freezerId: mongoose.Types.ObjectId;

  freezer: {
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

  value: number;
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
    value: number;
    changedAt: Date;
    changedBy: mongoose.Types.ObjectId;
  }[];

  approvalHistory: {
    approvedBy: mongoose.Types.ObjectId;
    approvedAt: Date;
  }[];
}

const temperatureLogSchema = new Schema<ITemperatureLog>(
  {
    /* ---------------- FREEZER SNAPSHOT ---------------- */
    freezerId: {
      type: Schema.Types.ObjectId,
      ref: "Freezer",
      required: true,
    },

    freezer: {
      id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      icon: { type: String, required: true },
    },

    /* ---------------- EMPLOYEE SNAPSHOT ---------------- */
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

    /* ---------------- TEMPERATURE DATA ---------------- */
    value: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    /* ---------------- APPROVAL SECTION ---------------- */
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

    /* ---------------- CHANGE TRACKING ---------------- */
    changeStatus: {
      type: Boolean,
      default: false,
    },

    changeHistory: [
      {
        value: Number,
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
  },
  { timestamps: true }
);

export default mongoose.model<ITemperatureLog>(
  "TemperatureLog",
  temperatureLogSchema
);