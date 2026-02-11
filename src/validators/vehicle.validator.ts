import { param } from "express-validator";

export const licencePlateValidator = [
  param("licencePlate")
    .isLength({ min: 6 })
    .withMessage("Invalid licence plate number")
];