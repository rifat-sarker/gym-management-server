import express from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { BookingController } from "./booking.controller";

const router = express.Router();

router.get("/", auth(Role.ADMIN), BookingController.getAllBookings);
router.get("/my-Bookings", auth(Role.TRAINEE), BookingController.myBookings);
router.post("/:scheduleId", auth(Role.TRAINEE), BookingController.bookSchedule);
router.post(
  "/cancel/:bookingId",
  auth(Role.TRAINEE),
  BookingController.cancelBooking
);

export const BookingRoutes = router;
