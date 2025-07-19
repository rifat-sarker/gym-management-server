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
exports.ScheduleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const schedule_service_1 = require("./schedule.service");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const scheduleData = req.body;
    const createdByUserId = req.user.id;
    const result = yield schedule_service_1.ScheduleService.createScheduleIntoDB(scheduleData, createdByUserId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Schedule created successfully",
        data: result,
    });
}));
const getAllSchedules = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield schedule_service_1.ScheduleService.getAllSchedules();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Schedules retrieved successfully",
        data: result,
    });
}));
const getScheduleById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const scheduleId = req.params.id;
    const result = yield schedule_service_1.ScheduleService.getScheduleById(scheduleId);
    if (!result) {
        throw new Error("Schedule not found");
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Schedule retrieved successfully",
        data: result,
    });
}));
const updateSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const scheduleId = req.params.id;
    const updateData = req.body;
    const result = yield schedule_service_1.ScheduleService.updateSchedule(scheduleId, updateData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Schedule updated successfully",
        data: result,
    });
}));
const deleteSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const scheduleId = req.params.id;
    const result = yield schedule_service_1.ScheduleService.deleteSchedule(scheduleId);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Schedule not found");
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Schedule deleted successfully",
        data: null,
    });
}));
exports.ScheduleController = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
};
