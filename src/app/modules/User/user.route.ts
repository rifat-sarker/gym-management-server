import express from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { validateRequest } from "../../middlewares/validationRequest";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/create-trainer",
  auth(Role.ADMIN),
  validateRequest(UserValidation.CreateTrainerZodSchema),
  UserController.createTrainer
);
router.get("/", auth(Role.ADMIN), UserController.getUser);

router.get("/me", auth(), UserController.getMyProfile);

router.patch(
  "/me",
  auth(),
  validateRequest(UserValidation.UpdateProfileZodSchema),
  UserController.updateMyProfile
);

router.get("/:id", auth(Role.ADMIN), UserController.getUserById);
export const UserRoutes = router;
