import { Router, Request, Response } from "express";
import { AddOn } from "../models/addon.model";

const router = Router();

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