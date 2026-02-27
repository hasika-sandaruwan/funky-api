import mongoose, { Document, Schema } from "mongoose";

export interface IToiletCleanLog extends Document {
  toiletId: mongoose.Types.ObjectId;

  toilet: {
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

  images: string[];

  comment?: string;

  approved: boolean;

  approvedBy?: {
    id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  };

  approvedAt?: Date;

  changeStatus: boolean;

  changeHistory: {
    changedAt: Date;
    changedBy: mongoose.Types.ObjectId;
  }[];

  approvalHistory: {
    approvedBy: mongoose.Types.ObjectId;
    approvedAt: Date;
  }[];
}

const toiletCleanLogSchema = new Schema<IToiletCleanLog>(
  {
    toiletId: {
      type: Schema.Types.ObjectId,
      ref: "Toilet",
      required: true,
    },

    toilet: {
      id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      icon: { type: String, required: true },
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

    images: [
      {
        type: String,
      },
    ],

    comment: {
      type: String,
      maxlength: 1000,
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

    changeStatus: {
      type: Boolean,
      default: false,
    },

    changeHistory: [
      {
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

export default mongoose.model<IToiletCleanLog>(
  "ToiletCleanLog",
  toiletCleanLogSchema
);