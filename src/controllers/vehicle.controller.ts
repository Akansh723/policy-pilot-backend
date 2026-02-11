import { Request, Response } from "express";
import { Vehicle } from "../models/vehicle.model";
import { successResponse } from "../utils/response";

export const getVehicleByLicencePlate = async (
  req: Request,
  res: Response
) => {
  const { licencePlate } = req.params;

  const vehicle = await Vehicle.findOne({
    licencePlate: licencePlate.toUpperCase()
  }).lean();

  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: "Vehicle not found"
    });
  }

  return successResponse(res, 200, "Vehicle details fetched", {
    licencePlate: vehicle.licencePlate,
    ownerName: vehicle.ownerName,
    carName: vehicle.carName,
    company: vehicle.company,
    purchaseYear: vehicle.purchaseYear,
    insuranceExpiryDate: vehicle.insuranceExpiryDate,
    insuranceClaimsCount: vehicle.insuranceClaimsCount,
    fuelType: vehicle.fuelType,
    transmission: vehicle.transmission,
    vehicleType: vehicle.vehicleType,
    city: vehicle.city,
    usageType: vehicle.usageType,
    lastAccidentDate: vehicle.lastAccidentDate
  });
};