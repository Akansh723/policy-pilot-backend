import { Request, Response } from "express";
import { User } from "../models/user.model";
import { successResponse } from "../utils/response";

export const getProfile = async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const user = await User.findById(userId).select("-otp -otpExpiresAt");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  return successResponse(res, 200, "User profile fetched", {
    id: user._id,
    mobile: user.mobile,
    name: user.name,
    age: user.age,
    gender: user.gender,
    createdAt: user.createdAt
  });
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { name, age, gender } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { name, age, gender },
    { new: true, runValidators: true }
  ).select("-otp -otpExpiresAt");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  return successResponse(res, 200, "Profile updated successfully", {
    id: user._id,
    mobile: user.mobile,
    name: user.name,
    age: user.age,
    gender: user.gender
  });
};