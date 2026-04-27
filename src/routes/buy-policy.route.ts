import { Router, Request, Response } from "express";
import { PolicyPurchase } from "../models/policyPurchase.model";
import { successResponse } from "../utils/response";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { purchasePolicy } from "../controllers/policy.controller";
import { purchasePolicyValidator } from "../validators/policy.validator";
import { cache, invalidateCache } from "../middlewares/cache.middleware";
import { razorpay } from "../utils/razorpay";
import crypto from "crypto";

const router = Router();

/**
 * @swagger
 * /policy/all:
 *   get:
 *     summary: Get all purchased policies (Admin)
 *     tags: [Policy Purchase]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all purchased policies
 */
router.get("/all", authenticate, cache(300, () => "cache:policies:all"), async (req: Request, res: Response) => {
  const policies = await PolicyPurchase.find()
    .populate("userId", "mobile name")
    .populate("vehicleId")
    .populate("policyId")
    .populate("addons")
    .sort({ createdAt: -1 });
  
  return successResponse(res, 200, "All purchased policies", policies);
});

router.post(
  "/purchase",
  authenticate,
  purchasePolicyValidator,
  validate,
  purchasePolicy
);

/**
 * @swagger
 * /policy/buy:
 *   post:
 *     summary: Purchase a policy
 *     tags: [Policy Purchase]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *               - policyId
 *               - basePremium
 *             properties:
 *               vehicleId:
 *                 type: string
 *               policyId:
 *                 type: string
 *               addons:
 *                 type: array
 *                 items:
 *                   type: string
 *               basePremium:
 *                 type: number
 *               addonsPremium:
 *                 type: number
 *     responses:
 *       201:
 *         description: Policy purchased successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/buy", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const {
      vehicleId,
      policyId,
      addons = [],
      basePremium,
      addonsPremium = 0
    } = req.body;

    if (!vehicleId || !policyId || !basePremium) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const totalPremium = basePremium + addonsPremium;

    const existing = await PolicyPurchase.findOne({
      userId,
      vehicleId,
      policyId,
      status: "PENDING",
    });

    if (existing) {
      return successResponse(res, 200, "Order already exists", {
        purchaseId: existing._id,
        orderId: existing.razorpayOrderId,
        amount: Math.round(existing.totalPremium * 100),
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(totalPremium * 100),
      currency: "INR",
      receipt: `policy_${Date.now()}`,
    });

    const purchase = await PolicyPurchase.create({
      userId,
      vehicleId,
      policyId,
      addons,
      basePremium,
      addonsPremium,
      totalPremium,
      policyNumber: `POL-${Date.now()}`,
      policyExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: "PENDING",
      razorpayOrderId: order.id,
    });

    return successResponse(res, 201, "Order created", {
      purchaseId: purchase._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/payment/verify", authenticate, async (req: Request, res: Response) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const purchase = await PolicyPurchase.findOne({ razorpayOrderId, userId: req.user!.userId });
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expected !== razorpaySignature) {
      purchase.status = "PAYMENT_FAILED";
      await purchase.save();
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    purchase.razorpayPaymentId = razorpayPaymentId;
    purchase.razorpaySignature = razorpaySignature;
    if (purchase.status === "PENDING") {
      purchase.status = "ACTIVE";
    }
    await purchase.save();

    invalidateCache(`cache:policies:my:${req.user!.userId}`, "cache:policies:all").catch(() => {});

    return successResponse(res, 200, "Payment verified", { purchaseId: purchase._id, status: purchase.status });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});


/**
 * @swagger
 * /policy/my:
 *   get:
 *     summary: Get my purchased policies
 *     tags: [Policy Purchase]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's purchased policies
 */
router.get("/my", authenticate, cache(300, (req) => `cache:policies:my:${req.user!.userId}`), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  
  const policies = await PolicyPurchase.find({ userId })
  .populate("vehicleId")
  .populate("policyId")
  .populate("addons")
  .sort({ createdAt: -1 });
  
  return successResponse(res, 200, "My policies", policies);
});

export default router;