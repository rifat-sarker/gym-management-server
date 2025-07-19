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
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany({});
    return result;
});
const getUserByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
});
const getMyProfileFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    return result;
});
const updateMyProfileIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const updatedUser = yield prisma_1.default.user.update({
        where: { id: userId },
        data: {
            name: payload.name,
            email: payload.email,
            updatedAt: new Date(),
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            updatedAt: true,
        },
    });
    return updatedUser;
});
const createTrainerInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, role } = payload;
    const isExist = yield prisma_1.default.user.findUnique({
        where: { email },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User with this email already exists");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const newTrainer = yield prisma_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: client_1.Role.TRAINER,
        },
    });
    return newTrainer;
});
exports.UserService = {
    getUsersFromDB,
    getUserByIdFromDB,
    getMyProfileFromDB,
    updateMyProfileIntoDB,
    createTrainerInDB,
};
