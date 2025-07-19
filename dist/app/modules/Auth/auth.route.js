"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const validationRequest_1 = require("../../middlewares/validationRequest");
const router = express_1.default.Router();
router.post("/register", (0, validationRequest_1.validateRequest)(auth_validation_1.AuthValidation.registerUserSchema), auth_controller_1.AuthController.registerTrainee);
router.post("/login", (0, validationRequest_1.validateRequest)(auth_validation_1.AuthValidation.loginUserSchema), auth_controller_1.AuthController.loginUser);
exports.AuthRoutes = router;
