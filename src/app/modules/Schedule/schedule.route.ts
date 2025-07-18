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

router.get("/", auth(Role.ADMIN), ScheduleController.getAllSchedules);
router.get("/:id", auth(Role.ADMIN), ScheduleController.getScheduleById);
router.patch(
  "/:id",
  auth(Role.ADMIN),
  validateRequest(ScheduleValidation.UpdateScheduleZodSchema),
  ScheduleController.updateSchedule
);
router.delete("/:id", auth(Role.ADMIN), ScheduleController.deleteSchedule);

export const ScheduleRoutes = router;
