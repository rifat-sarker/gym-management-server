import express from "express";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import { validateRequest } from "../../middlewares/validationRequest";

const router = express.Router();

router.post(
  "/register",
  validateRequest(AuthValidation.registerUserSchema),
  AuthController.registerTrainee
);

export const AuthRoutes = router;
