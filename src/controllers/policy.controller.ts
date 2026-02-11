import { Request, Response } from "express";
import { Vehicle } from "../models/vehicle.model";
import { PolicyPurchase } from "../models/policyPurchase.model";
import { successResponse } from "../utils/response";
import { generatePolicyNumber } from "../utils/policyNumber";

const POLICY_DURATION_YEARS = 1;

const setExpiryDate = (years: number): Date => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + years);
  return date;
};

export const purchasePolicy = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { vehicleDetails, policyId, addons = [], basePremium, addonsPremium = 0 } = req.body;

  if (!vehicleDetails || !policyId || !basePremium) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  let vehicle = await Vehicle.findOne({
    licencePlate: vehicleDetails.licencePlate.toUpperCase()
  });

  if (!vehicle) {
    if (!vehicleDetails.insuranceExpiryDate) {
      vehicleDetails.insuranceExpiryDate = setExpiryDate(POLICY_DURATION_YEARS);
    }
    vehicle = await Vehicle.create(vehicleDetails);
  }

  const purchase = await PolicyPurchase.create({
    userId,
    vehicleId: vehicle._id,
    policyId,
    addons,
    policyNumber: generatePolicyNumber(),
    basePremium,
    addonsPremium,
    totalPremium: basePremium + addonsPremium,
    policyExpiryDate: setExpiryDate(POLICY_DURATION_YEARS),
    status: "REVIEW"
  });

  return successResponse(res, 201, "Policy submitted for review", {
    purchaseId: purchase._id,
    policyNumber: purchase.policyNumber,
    vehicleId: vehicle._id,
    policyExpiryDate: purchase.policyExpiryDate,
    totalPremium: purchase.totalPremium,
    status: purchase.status
  });
};