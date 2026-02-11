
import { body } from "express-validator";

export const requestOTPValidator = [
  body("mobile")
    .isMobilePhone("en-IN")
    .withMessage("Invalid mobile number")
];

export const verifyOTPValidator = [
  body("mobile").isMobilePhone("en-IN"),
  body("otp").isLength({ min: 6, max: 6 })
];