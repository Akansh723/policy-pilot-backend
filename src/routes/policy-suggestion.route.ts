import { Router, Request, Response } from "express";
import { Vehicle } from "../models/vehicle.model";
import { Policy } from "../models/policy.model";
import { AddOn } from "../models/addon.model";

const router = Router();

const AGE_PREMIUM_FACTOR = 300;
const COMMERCIAL_MARKUP = 0.2;
const CLAIM_PENALTY = 0.1;

const getPurchaseYearGap = (age: number): 2 | 5 | 7 | 10 => {
  if (age <= 2) return 2;
  if (age <= 5) return 5;
  if (age <= 7) return 7;
  return 10;
};

const calculatePremium = (policy: any, vehicleAge: number, vehicleData: any) => {
  let premium = policy.basePremium + vehicleAge * AGE_PREMIUM_FACTOR;

  if (vehicleData.usageType === "commercial") {
    premium += premium * COMMERCIAL_MARKUP;
  }

  premium += vehicleData.insuranceClaimsCount * premium * CLAIM_PENALTY;

  if (policy.claimBonusPercentage) {
    premium -= premium * (policy.claimBonusPercentage / 100);
  }

  return Math.round(premium);
};

const calculateAddonPrice = (addon: any, premium: number) => {
  return addon.priceType === "flat"
    ? addon.priceValue
    : Math.round((premium * addon.priceValue) / 100);
};

router.get("/suggest/:licencePlate", async (req: Request, res: Response) => {
  try {
    const licencePlate = req.params.licencePlate.toUpperCase();
    const { fuelType, usageType, purchaseYear, insuranceClaimsCount } = req.query;

    let vehicle = await Vehicle.findOne({ licencePlate });
    let vehicleData;

    if (!vehicle) {
      if (!fuelType || !usageType || !purchaseYear) {
        return res.status(400).json({
          success: false,
          message: "Vehicle not found. Please provide fuelType, usageType, and purchaseYear as query parameters"
        });
      }
      vehicleData = {
        licencePlate,
        fuelType: fuelType as string,
        usageType: usageType as string,
        purchaseYear: parseInt(purchaseYear as string),
        insuranceClaimsCount: insuranceClaimsCount ? parseInt(insuranceClaimsCount as string) : 0
      };
    } else {
      vehicleData = {
        licencePlate: vehicle.licencePlate,
        carName: vehicle.carName,
        company: vehicle.company,
        fuelType: vehicle.fuelType,
        usageType: vehicle.usageType,
        purchaseYear: vehicle.purchaseYear,
        insuranceClaimsCount: vehicle.insuranceClaimsCount
      };
    }

    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - vehicleData.purchaseYear;
    const purchaseYearGap = getPurchaseYearGap(vehicleAge);

    const policies = await Policy.find({
      category: "car",
      fuelType: vehicleData.fuelType,
      usageType: vehicleData.usageType,
      purchaseYearGap
    });

    if (!policies.length) {
      return res.status(404).json({
        success: false,
        message: "No matching policy found"
      });
    }

    const allAddOns = await AddOn.find();
    const eligibleAddOns = allAddOns.filter((addon) => {
      if (addon.maxVehicleAge && vehicleAge > addon.maxVehicleAge) return false;
      if (addon.applicableForFuel?.length && !addon.applicableForFuel.includes(vehicleData.fuelType as any)) return false;
      return true;
    });

    const evaluatedPolicies = policies.map((policy) => {
      const premium = calculatePremium(policy, vehicleAge, vehicleData);
      const addonsWithPrice = eligibleAddOns.map((addon) => ({
        addonId: addon._id,
        name: addon.name,
        code: addon.code,
        price: calculateAddonPrice(addon, premium)
      }));

      return {
        policyId: policy._id,
        providerName: policy.providerName,
        basePremium: policy.basePremium,
        finalPremium: premium,
        idvPercentage: policy.idvPercentage,
        purchaseYearGap: policy.purchaseYearGap,
        addons: addonsWithPrice
      };
    });

    evaluatedPolicies.sort((a, b) => a.finalPremium - b.finalPremium);

    return res.status(200).json({
      success: true,
      vehicle: vehicleData,
      bestPolicy: evaluatedPolicies[0],
      allOptions: evaluatedPolicies
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