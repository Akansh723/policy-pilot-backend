import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateProfileValidator } from "../validators/user.validator";

const router = Router();

router.get("/profile", authenticate, getProfile);

router.put(
  "/profile",
  authenticate,
  updateProfileValidator,
  validate,
  updateProfile
);

export default router;