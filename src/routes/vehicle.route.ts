import { Router } from "express";
import { getVehicleByLicencePlate } from "../controllers/vehicle.controller";
import { validate } from "../middlewares/validate.middleware";
import { licencePlateValidator } from "../validators/vehicle.validator";

const router = Router();

/**
 * @swagger
 * /vehicle/{licencePlate}:
 *   get:
 *     summary: Get vehicle by license plate
 *     tags: [Vehicle]
 *     parameters:
 *       - in: path
 *         name: licencePlate
 *         required: true
 *         schema:
 *           type: string
 *         example: "DL01AB1234"
 *     responses:
 *       200:
 *         description: Vehicle found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Vehicle not found
 */
router.get(
  "/:licencePlate",
  licencePlateValidator,
  validate,
  getVehicleByLicencePlate
);

export default router;