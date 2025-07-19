"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong";
    let errorDetails = [
        {
            path: "",
            message: "Something went wrong",
        },
    ];
    if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err.name === "ZodError") {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorDetails = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorDetails = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if (err instanceof Error) {
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
        errorDetails,
        stack: config_1.default.node_env === "development" ? err === null || err === void 0 ? void 0 : err.stack : undefined,
    });
};
exports.default = globalErrorHandler;
