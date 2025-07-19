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
exports.ScheduleService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const client_1 = require("@prisma/client");
const createScheduleIntoDB = (payload, createdBy) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, startTime, endTime, trainerId } = payload;
    const trainer = yield prisma_1.default.user.findUnique({ where: { id: trainerId } });
    if (!trainer || trainer.role !== client_1.Role.TRAINER) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid or unauthorized trainer");
    }
    const dateOnlyString = new Date(date).toISOString().split("T")[0];
    const startDateTime = new Date(`${dateOnlyString}T${startTime}Z`);
    const endDateTime = new Date(`${dateOnlyString}T${endTime}Z`);
    const dateOnlyUTC = new Date(`${dateOnlyString}T00:00:00Z`);
    const duration = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
    if (duration !== 2) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Each class must be exactly 2 hours long");
    }
    const existingSchedules = yield prisma_1.default.schedule.count({
        where: { date: dateOnlyUTC },
    });
    if (existingSchedules >= 5) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cannot create more than 5 schedules per day");
    }
    const overlappingSchedule = yield prisma_1.default.schedule.findFirst({
        where: {
            date: dateOnlyUTC,
            trainerId,
            AND: [
                { startTime: { lt: endDateTime } },
                { endTime: { gt: startDateTime } },
            ],
        },
    });
    if (overlappingSchedule) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Trainer already has a schedule during this time slot");
    }
    const newSchedule = yield prisma_1.default.schedule.create({
        data: {
            date: dateOnlyUTC,
            startTime: startDateTime,
            endTime: endDateTime,
            trainerId,
            createdBy,
        },
    });
    return newSchedule;
});
const getAllSchedules = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.schedule.findMany({
        include: {
            trainer: true,
            bookings: true,
        },
    });
    return result;
});
const getScheduleById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.schedule.findUnique({ where: { id } });
    return result;
});
const updateSchedule = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, startTime, endTime, trainerId } = payload;
    const existingSchedule = yield prisma_1.default.schedule.findUnique({ where: { id } });
    if (!existingSchedule) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Schedule not found");
    }
    const trainer = yield prisma_1.default.user.findUnique({ where: { id: trainerId } });
    if (!trainer || trainer.role !== client_1.Role.TRAINER) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid or unauthorized trainer");
    }
    const dateOnlyString = new Date(date).toISOString().split("T")[0];
    const startDateTime = new Date(`${dateOnlyString}T${startTime}Z`);
    const endDateTime = new Date(`${dateOnlyString}T${endTime}Z`);
    const dateOnlyUTC = new Date(`${dateOnlyString}T00:00:00Z`);
    const duration = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
    if (duration !== 2) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Each class must be exactly 2 hours long");
    }
    const overlappingSchedule = yield prisma_1.default.schedule.findFirst({
        where: {
            id: { not: id },
            date: dateOnlyUTC,
            trainerId,
            AND: [
                { startTime: { lt: endDateTime } },
                { endTime: { gt: startDateTime } },
            ],
        },
    });
    if (overlappingSchedule) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Trainer already has a schedule during this time slot");
    }
    const updatedSchedule = yield prisma_1.default.schedule.update({
        where: { id },
        data: {
            date: dateOnlyUTC,
            startTime: startDateTime,
            endTime: endDateTime,
            trainerId,
        },
    });
    return updatedSchedule;
});
const deleteSchedule = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.schedule.delete({ where: { id } });
    return result;
});
exports.ScheduleService = {
    createScheduleIntoDB,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
};
