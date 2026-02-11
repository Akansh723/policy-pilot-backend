import { body } from "express-validator";

export const updateProfileValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .trim(),
  body("age")
    .notEmpty()
    .withMessage("Age is required")
    .isInt({ min: 18, max: 100 })
    .withMessage("Age must be between 18 and 100"),
  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other")
];