import { Router, Request, Response } from "express";
import { AddOn } from "../models/addon.model";

const router = Router();

/**
 * @swagger
 * /addOns/add:
 *   post:
 *     summary: Create a new add-on
 *     tags: [Add-ons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - priceType
 *               - priceValue
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Zero Depreciation"
 *               code:
 *                 type: string
 *                 example: "ZERO_DEP"
 *               description:
 *                 type: string
 *                 example: "No depreciation on claim"
 *               priceType:
 *                 type: string
 *                 enum: [flat, percentage]
 *                 example: "percentage"
 *               priceValue:
 *                 type: number
 *                 example: 15
 *               maxVehicleAge:
 *                 type: number
 *                 example: 5
 *               applicableForFuel:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [petrol, diesel, electric, cng]
 *     responses:
 *       201:
 *         description: Add-on created successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Add-on code already exists
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name,
      code,
      description,
      priceType,
      priceValue,
      maxVehicleAge,
      applicableForFuel
    } = req.body;

    if (!name || !code || !priceType || !priceValue) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const addOn = await AddOn.create({
      name,
      code,
      description,
      priceType,
      priceValue,
      maxVehicleAge,
      applicableForFuel
    });

    return res.status(201).json({
      success: true,
      message: "Add-on created successfully",
      data: addOn
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Add-on with this code already exists"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

export default router;