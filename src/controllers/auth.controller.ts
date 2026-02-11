import { Request, Response } from "express";
import { User } from "../models/user.model";
import { generateOTP, hashOTP, verifyOTP } from "../utils/otp";
import { signToken } from "../utils/jwt";
import { successResponse } from "../utils/response";
import { sendOTPSMS } from "../utils/sms";
import { env } from "../config/env";

const OTP_EXPIRY_MINUTES = 5;

export const requestOTP = async (req: Request, res: Response) => {
  const { mobile } = req.body;

  let user = await User.findOne({ mobile });
  if (!user) {
    user = await User.create({ mobile });
  }

  const otp = generateOTP();
  const hashedOTP = await hashOTP(otp);

  user.otp = hashedOTP;
  user.otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  await user.save();

  try {
    await sendOTPSMS(mobile, otp);
  } catch (error) {
    console.error("SMS sending failed:", error);
    if (env.nodeEnv === "development") {
      console.log("OTP (DEV ONLY):", otp);
    }
  }

  return successResponse(res, 200, "OTP sent successfully");
};

export const verifyOTPAndLogin = async (req: Request, res: Response) => {
  const { mobile, otp } = req.body;

  const user = await User.findOne({ mobile });

  if (!user || !user.otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    return res.status(401).json({
      success: false,
      message: "OTP expired or invalid"
    });
  }

  const isValid = await verifyOTP(otp, user.otp);
  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid OTP"
    });
  }

  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  const token = signToken({ userId: user._id });
  const userData = {
    id: user._id,
    mobile: user.mobile,
    name: user.name,
    createdAt: user.createdAt
  };
  
  return successResponse(res, 200, "Login successful", {
    token,
    user: userData,
    isNewUser: !user.name
  });
};