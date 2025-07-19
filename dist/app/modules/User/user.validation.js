"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const CreateTrainerZodSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string().min(1, "Name is required"),
        email: zod_1.default.string().email("Invalid email format"),
        password: zod_1.default.string().min(6, "Password must be at least 6 characters"),
        role: zod_1.default.nativeEnum(client_1.Role).optional(),
    }),
});
const UpdateProfileZodSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string().optional(),
        email: zod_1.default.string().email("Invalid email format").optional(),
        password: zod_1.default
            .string()
            .min(6, "Password must be at least 6 characters")
            .optional(),
    }),
});
exports.UserValidation = {
    CreateTrainerZodSchema,
    UpdateProfileZodSchema,
};
