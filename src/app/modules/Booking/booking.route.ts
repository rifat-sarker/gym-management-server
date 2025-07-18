import express from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { validateRequest } from "../../middlewares/validationRequest";
import { BookingController } from "./booking.controller";

const router = express.Router();

router.post("/:scheduleId", auth(Role.TRAINEE), BookingController.bookSchedule);

export const BookingRoutes = router;
