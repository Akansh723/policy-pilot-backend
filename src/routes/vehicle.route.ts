import { Router } from "express";
import { getVehicleByLicencePlate } from "../controllers/vehicle.controller";
import { validate } from "../middlewares/validate.middleware";
import { licencePlateValidator } from "../validators/vehicle.validator";

const router = Router();

router.get(
  "/:licencePlate",
  licencePlateValidator,
  validate,
  getVehicleByLicencePlate
);

export default router;