"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
    ],
    credentials: true,
}));
app.get("/", (request, response) => {
    response.send("Welcome to Gym Management Server");
});
// application routes
app.use("/api", routes_1.default);
// global error handler
app.use(globalErrorHandler_1.default);
// not found
app.use(notFound_1.default);
exports.default = app;
