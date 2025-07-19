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
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createToken_1 = require("../../utils/createToken");
const config_1 = __importDefault(require("../../config"));
const registerTraineeInToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = payload;
    if (!name || !email || !password) {
        throw new Error("Name, email, and password are required.");
    }
    const isExistUser = yield prisma_1.default.user.findFirst({
        where: { email: email },
    });
    if (isExistUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already exists");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    if (!hashedPassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to hash password. Please try again.");
    }
    const registerUser = yield prisma_1.default.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
            role: client_1.Role.TRAINEE,
        },
    });
    const jwtPayload = {
        id: registerUser.id,
        email: registerUser.email,
        role: registerUser.role,
    };
    const accessToken = (0, createToken_1.createToken)(jwtPayload, config_1.default.jwt.jwt_scret, config_1.default.jwt.expires_in);
    return accessToken;
});
const loginUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.email || !payload.password) {
        throw new AppError_1.default(http_status_1.default.NON_AUTHORITATIVE_INFORMATION, "Missing required fields");
    }
    const isExistUser = yield prisma_1.default.user.findFirst({
        where: { email: payload.email },
    });
    if (!isExistUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid email or password please try again");
    }
    const checkPassword = yield bcryptjs_1.default.compare(payload.password, isExistUser === null || isExistUser === void 0 ? void 0 : isExistUser.password);
    if (!checkPassword) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid email or password please try again");
    }
    const jwtPayload = {
        id: isExistUser.id,
        email: isExistUser.email,
        role: isExistUser.role,
    };
    const accessToken = (0, createToken_1.createToken)(jwtPayload, config_1.default.jwt.jwt_scret, config_1.default.jwt.expires_in);
    const refeshToken = (0, createToken_1.createToken)(jwtPayload, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    const result = {
        accessToken,
        refeshToken,
    };
    return result;
});
exports.AuthService = {
    registerTraineeInToDB,
    loginUserIntoDB,
};
