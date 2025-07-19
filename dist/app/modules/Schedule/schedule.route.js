"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validationRequest_1 = require("../../middlewares/validationRequest");
const schedule_validation_1 = require("./schedule.validation");
const schedule_controller_1 = require("./schedule.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.Role.ADMIN), (0, validationRequest_1.validateRequest)(schedule_validation_1.ScheduleValidation.CreateScheduleZodSchema), schedule_controller_1.ScheduleController.createSchedule);
router.get("/", (0, auth_1.default)(client_1.Role.ADMIN), schedule_controller_1.ScheduleController.getAllSchedules);
router.get("/:id", (0, auth_1.default)(client_1.Role.ADMIN), schedule_controller_1.ScheduleController.getScheduleById);
router.patch("/:id", (0, auth_1.default)(client_1.Role.ADMIN), (0, validationRequest_1.validateRequest)(schedule_validation_1.ScheduleValidation.UpdateScheduleZodSchema), schedule_controller_1.ScheduleController.updateSchedule);
router.delete("/:id", (0, auth_1.default)(client_1.Role.ADMIN), schedule_controller_1.ScheduleController.deleteSchedule);
exports.ScheduleRoutes = router;
