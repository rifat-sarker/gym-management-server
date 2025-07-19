"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodValidationError = (err) => {
    const errorSources = err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
    }));
    return {
        statusCode: 400,
        message: "Validation error",
        errorSources,
    };
};
exports.default = handleZodValidationError;
