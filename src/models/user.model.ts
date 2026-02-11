import { Schema, Document } from "mongoose";
import { userDb } from "../config/databases";

export interface IUser extends Document {
  mobile: string;
  otp?: string;
  otpExpiresAt?: Date;
  name?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  createdAt?: Date
}

const userSchema = new Schema<IUser>(
  {
    mobile: {
      type: String,
      required: true,
      unique: true
    },
    otp: {
      type: String
    },
    otpExpiresAt: {
      type: Date
    },
    name: {
      type: String
    },
    age: {
      type: Number
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"]
    },
    createdAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export const User = userDb.model<IUser>("user", userSchema);