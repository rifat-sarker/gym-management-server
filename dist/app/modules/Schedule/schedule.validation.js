"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleValidation = void 0;
const zod_1 = require("zod");
const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
const CreateScheduleZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z
            .string()
            .nonempty("Date is required")
            .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }),
        startTime: zod_1.z
            .string()
            .nonempty("Start time is required")
            .regex(timeRegex, "Start time must be in HH:mm:ss format"),
        endTime: zod_1.z
            .string()
            .nonempty("End time is required")
            .regex(timeRegex, "End time must be in HH:mm:ss format"),
        trainerId: zod_1.z.string().nonempty("Trainer ID is required"),
    }),
});
const UpdateScheduleZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z
            .string()
            .optional()
            .refine((val) => (val ? !isNaN(Date.parse(val)) : true), {
            message: "Invalid date format",
        }),
        startTime: zod_1.z
            .string()
            .regex(timeRegex, "Start time must be in HH:mm:ss format")
            .optional(),
        endTime: zod_1.z
            .string()
            .regex(timeRegex, "End time must be in HH:mm:ss format")
            .optional(),
        trainerId: zod_1.z.string().optional(),
        createdBy: zod_1.z.string().optional(),
    }),
});
exports.ScheduleValidation = {
    CreateScheduleZodSchema,
    UpdateScheduleZodSchema,
};
