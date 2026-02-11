import { Schema } from "mongoose";
import { insuranceDb } from "../config/databases";

export interface IAddOn {
  name: string;
  code: string;
  description: string;
  priceType: "flat" | "percentage";
  priceValue: number;
  maxVehicleAge?: number;
  applicableForFuel?: Array<"petrol" | "diesel" | "electric" | "hybrid">;
}

const addOnSchema = new Schema<IAddOn>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    priceType: {
      type: String,
      enum: ["flat", "percentage"],
      required: true
    },
    priceValue: { type: Number, required: true },
    maxVehicleAge: { type: Number },
    applicableForFuel: [{ type: String }]
  },
  { timestamps: true }
);

export const AddOn = insuranceDb.model<IAddOn>(
  "addOns",
  addOnSchema
);