import { Router, Request, Response } from "express";
import { PolicyPurchase } from "../models/policyPurchase.model";
import { successResponse } from "../utils/response";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { purchasePolicy } from "../controllers/policy.controller";
import { purchasePolicyValidator } from "../validators/policy.validator";

const router = Router();

router.get("/all", authenticate, async (req: Request, res: Response) => {
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

router.post("/buy", authenticate,  async (req: Request, res: Response) => {
  const userId = req.user.userId; 
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

  return successResponse(
    res,
    201,
    "Policy submitted for review",
    purchase
  );
});


router.get("/my", authenticate, async (req: Request, res: Response) => {
  const userId = req.user.userId;
  
  const policies = await PolicyPurchase.find({ userId })
  .populate("vehicleId")
  .populate("policyId")
  .populate("addons")
  .sort({ createdAt: -1 });
  
  return successResponse(res, 200, "My policies", policies);
});

export default router;