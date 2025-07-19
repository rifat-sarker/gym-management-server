"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const MAX_TRAINEES_PER_SCHEDULE = 10;
const bookScheduleIntoDB = (traineeId, scheduleId) => __awaiter(void 0, void 0, void 0, function* () {
    const schedule = yield prisma_1.default.schedule.findUnique({
        where: { id: scheduleId },
    });
    if (!schedule) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Schedule not found");
    }
    const currentBookings = yield prisma_1.default.booking.count({
        where: { scheduleId },
    });
    if (currentBookings >= MAX_TRAINEES_PER_SCHEDULE) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Class schedule is full. Maximum 10 trainees allowed per schedule.");
    }
    const existingBooking = yield prisma_1.default.booking.findUnique({
        where: {
            traineeId_scheduleId: {
                traineeId,
                scheduleId,
            },
        },
    });
    if (existingBooking) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You have already booked this class");
    }
    const overlappingBooking = yield prisma_1.default.booking.findFirst({
        where: {
            traineeId,
            schedule: {
                startTime: { lt: schedule.endTime },
                endTime: { gt: schedule.startTime },
            },
        },
    });
    if (overlappingBooking) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You already have a booking in this time slot.");
    }
    const result = yield prisma_1.default.booking.create({
        data: {
            traineeId,
            scheduleId,
        },
    });
    return result;
});
const getAllBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.findMany();
    return result;
});
const cancelBookingIntoDB = (traineeId, bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield prisma_1.default.booking.findUnique({
        where: { id: bookingId },
        include: { schedule: true },
    });
    if (!booking) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found");
    }
    if (booking.traineeId !== traineeId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Not authorized to cancel this booking");
    }
    const result = yield prisma_1.default.booking.delete({ where: { id: bookingId } });
    return result;
});
const myBookingsIntoDB = (traineeId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookings = yield prisma_1.default.booking.findMany({
        where: { traineeId },
        include: { schedule: true },
    });
    return bookings;
});
exports.BookingService = {
    bookScheduleIntoDB,
    cancelBookingIntoDB,
    getAllBookings,
    myBookingsIntoDB,
};
