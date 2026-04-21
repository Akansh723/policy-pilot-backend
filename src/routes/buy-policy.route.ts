import { Router, Request, Response } from "express";
import { PolicyPurchase } from "../models/policyPurchase.model";
import { successResponse } from "../utils/response";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { purchasePolicy } from "../controllers/policy.controller";
import { purchasePolicyValidator } from "../validators/policy.validator";
import { cache, invalidateCache } from "../middlewares/cache.middleware";

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
router.post("/buy", authenticate,  async (req: Request, res: Response) => {
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

  const purchase = await PolicyPurchase.create({
    userId,
    vehicleId,
    policyId,
    addons,
    basePremium,
    addonsPremium,
    totalPremium
  });

  invalidateCache(`cache:policies:my:${userId}`, "cache:policies:all").catch(() => {});

  return successResponse(
    res,
    201,
    "Policy submitted for review",
    purchase
  );
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