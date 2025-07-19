"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const notFound = (req, res) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        status: http_status_1.default.NOT_FOUND,
        message: "API is not found",
        stack: config_1.default.node_env === "development" ? new Error().stack : undefined,
    });
};
exports.default = notFound;
