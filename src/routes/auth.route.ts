import { Router } from "express";
import {
  requestOTP,
  verifyOTPAndLogin,
  logout
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  requestOTPValidator,
  verifyOTPValidator
} from "../validators/auth.validator";

const router = Router();

/**
 * @swagger
 * /auth/request-otp:
 *   post:
 *     summary: Request OTP for login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid mobile number
 *       500:
 *         description: Server error
 */
router.post("/request-otp", requestOTPValidator, validate, requestOTP);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP and login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *               - otp
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */
router.post("/verify-otp", verifyOTPValidator, validate, verifyOTPAndLogin);

router.post("/logout", logout);

export default router;