import { Schema, Types } from "mongoose";
import { insuranceDb } from "../config/databases";

export interface IPolicyPurchase {
  userId: Types.ObjectId;
  vehicleId: Types.ObjectId;

  policyId: Types.ObjectId;
  addons: Types.ObjectId[];

  policyNumber: string;
  basePremium: number;
  addonsPremium: number;
  totalPremium: number;

  status: "PENDING" | "REVIEW" | "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAYMENT_FAILED";
  policyExpiryDate: Date;

  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  adminRemarks?: string;
  approvedAt?: Date;
}

const policyPurchaseSchema = new Schema<IPolicyPurchase>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: "vehicle", required: true },

    policyId: { type: Schema.Types.ObjectId, ref: "policies", required: true },
    addons: [{ type: Schema.Types.ObjectId, ref: "addOns" }],

    policyNumber: { type: String, required: true, unique: true },

    basePremium: { type: Number, required: true },
    addonsPremium: { type: Number, default: 0 },
    totalPremium: { type: Number, required: true },

    status: {
      type: String,
      enum: ["PENDING", "REVIEW", "ACTIVE", "CANCELLED", "EXPIRED", "PAYMENT_FAILED"],
      default: "PENDING"
    },
    policyExpiryDate: { type: Date, required: true },

    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: String,
    razorpaySignature: String,

    adminRemarks: String,
    approvedAt: Date
  },
  { timestamps: true }
);

export const PolicyPurchase = insuranceDb.model<IPolicyPurchase>(
  "policy_purchase",
  policyPurchaseSchema
);