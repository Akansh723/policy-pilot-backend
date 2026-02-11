import { Router, Request, Response } from "express";
import { Policy } from "../models/policy.model";
import { getAllPolicies } from "../controllers/policyManagement.controller";

const router = Router();

router.get("/", getAllPolicies);

/**
 * POST /api/policies
 * Add insurance policy rule
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      category,
      fuelType,
      usageType,
      purchaseYearGap,
      basePremium,
      idvPercentage,
      claimBonusPercentage,
      providerName
    } = req.body;

    // basic validation
    if (
      !category ||
      !fuelType ||
      !usageType ||
      !purchaseYearGap ||
      !basePremium ||
      !providerName
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const policy = await Policy.create({
      category,
      fuelType,
      usageType,
      purchaseYearGap,
      basePremium,
      idvPercentage,
      claimBonusPercentage,
      providerName
    });

    return res.status(201).json({
      success: true,
      message: "Policy added successfully",
      data: policy
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

export default router;