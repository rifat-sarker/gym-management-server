import express from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { validateRequest } from "../../middlewares/validationRequest";
import { ScheduleValidation } from "./schedule.validation";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(ScheduleValidation.CreateScheduleZodSchema),
  ScheduleController.createSchedule
);

export const ScheduleRoutes = router;
