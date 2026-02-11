import { Router, Request, Response } from "express";
import { Policy } from "../models/policy.model";
import { getAllPolicies } from "../controllers/policyManagement.controller";

const router = Router();

/**
 * @swagger
 * /add-policy:
 *   get:
 *     summary: Get all policies
 *     tags: [Policy Management]
 *     responses:
 *       200:
 *         description: List of all policies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Policy'
 */
router.get("/", getAllPolicies);

/**
 * @swagger
 * /add-policy:
 *   post:
 *     summary: Add new insurance policy
 *     tags: [Policy Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - fuelType
 *               - usageType
 *               - purchaseYearGap
 *               - basePremium
 *               - providerName
 *             properties:
 *               category:
 *                 type: string
 *                 example: "car"
 *               fuelType:
 *                 type: string
 *                 enum: [petrol, diesel, electric, cng]
 *               usageType:
 *                 type: string
 *                 enum: [personal, commercial]
 *               purchaseYearGap:
 *                 type: number
 *                 example: 5
 *               basePremium:
 *                 type: number
 *                 example: 5000
 *               idvPercentage:
 *                 type: number
 *                 example: 80
 *               claimBonusPercentage:
 *                 type: number
 *                 example: 20
 *               providerName:
 *                 type: string
 *                 example: "HDFC ERGO"
 *     responses:
 *       201:
 *         description: Policy added successfully
 *       400:
 *         description: Missing required fields
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