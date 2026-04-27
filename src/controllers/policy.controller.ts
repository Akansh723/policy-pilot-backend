import { Request, Response } from "express";
import { Vehicle } from "../models/vehicle.model";
import { PolicyPurchase } from "../models/policyPurchase.model";
import { successResponse } from "../utils/response";
import { generatePolicyNumber } from "../utils/policyNumber";
import { razorpay } from "../utils/razorpay";

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

  const totalPremium = basePremium + addonsPremium;

  const existing = await PolicyPurchase.findOne({
    userId,
    vehicleId: vehicle._id,
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
    vehicleId: vehicle._id,
    policyId,
    addons,
    policyNumber: generatePolicyNumber(),
    basePremium,
    addonsPremium,
    totalPremium,
    policyExpiryDate: setExpiryDate(POLICY_DURATION_YEARS),
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
};