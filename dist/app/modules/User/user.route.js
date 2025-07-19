"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validationRequest_1 = require("../../middlewares/validationRequest");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.post("/create-trainer", (0, auth_1.default)(client_1.Role.ADMIN), (0, validationRequest_1.validateRequest)(user_validation_1.UserValidation.CreateTrainerZodSchema), user_controller_1.UserController.createTrainer);
router.get("/", (0, auth_1.default)(client_1.Role.ADMIN), user_controller_1.UserController.getUser);
router.get("/me", (0, auth_1.default)(), user_controller_1.UserController.getMyProfile);
router.patch("/me", (0, auth_1.default)(), (0, validationRequest_1.validateRequest)(user_validation_1.UserValidation.UpdateProfileZodSchema), user_controller_1.UserController.updateMyProfile);
router.get("/:id", (0, auth_1.default)(client_1.Role.ADMIN), user_controller_1.UserController.getUserById);
exports.UserRoutes = router;
