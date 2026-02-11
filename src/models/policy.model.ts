import { Schema } from "mongoose";
import { insuranceDb } from "../config/databases";

export interface IPolicy {
  category: "car" | "bike";
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  usageType: "personal" | "commercial";
  purchaseYearGap: 2 | 5 | 7 | 10;
  basePremium: number;
  idvPercentage?: number;
  claimBonusPercentage?: number;
  providerName: string;
}

const policySchema = new Schema<IPolicy>(
  {
    category: { type: String, required: true },
    fuelType: { type: String, required: true },
    usageType: { type: String, required: true },
    purchaseYearGap: { type: Number, required: true },
    basePremium: { type: Number, required: true },
    idvPercentage: { type: Number },
    claimBonusPercentage: { type: Number },
    providerName: { type: String, required: true }
  },
  { timestamps: true }
);

export const Policy = insuranceDb.model<IPolicy>(
  "policies",
  policySchema
);