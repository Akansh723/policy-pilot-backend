import { Router } from "express";
import {
  requestOTP,
  verifyOTPAndLogin
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  requestOTPValidator,
  verifyOTPValidator
} from "../validators/auth.validator";

const router = Router();

router.post("/request-otp", requestOTPValidator, validate, requestOTP);
router.post("/verify-otp", verifyOTPValidator, validate, verifyOTPAndLogin);

export default router;