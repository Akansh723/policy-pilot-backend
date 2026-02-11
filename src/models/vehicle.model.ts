import { Schema, Document } from "mongoose";
import { insuranceDb } from "../config/databases";

export interface IVehicle extends Document {
  licencePlate: string;
  ownerName: string;

  carName: string;
  company: string;
  purchaseYear: number;

  insuranceExpiryDate: Date;
  insuranceClaimsCount: number;

  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  transmission: "manual" | "automatic";
  vehicleType: "sedan" | "suv" | "hatchback";

  city: string;
  usageType: "personal" | "commercial";
  lastAccidentDate?: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    licencePlate: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true
    },
    ownerName: { type: String, required: true },

    carName: { type: String, required: true },
    company: { type: String, required: true },
    purchaseYear: { type: Number, required: true },

    insuranceExpiryDate: { type: Date, required: true },
    insuranceClaimsCount: { type: Number, default: 0 },

    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "electric", "hybrid"],
      required: true
    },
    transmission: {
      type: String,
      enum: ["manual", "automatic"],
      required: true
    },
    vehicleType: {
      type: String,
      enum: ["sedan", "suv", "hatchback"],
      required: true
    },

    city: { type: String, required: true },
    usageType: {
      type: String,
      enum: ["personal", "commercial"],
      required: true
    },
    lastAccidentDate: { type: Date }
  },
  { timestamps: true }
);

export const Vehicle = insuranceDb.model<IVehicle>(
  "vehicle",
  vehicleSchema
);