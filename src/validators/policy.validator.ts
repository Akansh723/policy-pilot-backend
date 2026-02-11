
import { body } from "express-validator";

export const purchasePolicyValidator = [
  body("vehicleDetails.licencePlate")
    .notEmpty()
    .withMessage("Licence plate is required"),
  body("vehicleDetails.ownerName")
    .notEmpty()
    .withMessage("Owner name is required"),
  body("vehicleDetails.carName")
    .notEmpty()
    .withMessage("Car name is required"),
  body("vehicleDetails.company")
    .notEmpty()
    .withMessage("Company is required"),
  body("vehicleDetails.purchaseYear")
    .isInt()
    .withMessage("Purchase year must be a number"),
  body("vehicleDetails.fuelType")
    .isIn(["petrol", "diesel", "electric", "hybrid"])
    .withMessage("Invalid fuel type"),
  body("vehicleDetails.transmission")
    .isIn(["manual", "automatic"])
    .withMessage("Invalid transmission"),
  body("vehicleDetails.vehicleType")
    .isIn(["sedan", "suv", "hatchback"])
    .withMessage("Invalid vehicle type"),
  body("vehicleDetails.city")
    .notEmpty()
    .withMessage("City is required"),
  body("vehicleDetails.usageType")
    .isIn(["personal", "commercial"])
    .withMessage("Invalid usage type"),
  body("policyId")
    .notEmpty()
    .withMessage("Policy ID is required"),
  body("basePremium")
    .isNumeric()
    .withMessage("Base premium must be a number"),
  body("addonsPremium")
    .optional()
    .isNumeric()
    .withMessage("Addons premium must be a number")
];
