"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const booking_controller_1 = require("./booking.controller");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.Role.ADMIN), booking_controller_1.BookingController.getAllBookings);
router.get("/my-Bookings", (0, auth_1.default)(client_1.Role.TRAINEE), booking_controller_1.BookingController.myBookings);
router.post("/:scheduleId", (0, auth_1.default)(client_1.Role.TRAINEE), booking_controller_1.BookingController.bookSchedule);
router.post("/cancel/:bookingId", (0, auth_1.default)(client_1.Role.TRAINEE), booking_controller_1.BookingController.cancelBooking);
exports.BookingRoutes = router;
