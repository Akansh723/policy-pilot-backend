import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

interface JwtPayload {
  userId: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Missing auth token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.userId).select("-otp");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      userId: user._id.toString(),
      mobile: user.mobile,
      name: user.name
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};