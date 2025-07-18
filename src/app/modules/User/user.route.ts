import express from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.get("/", auth(Role.ADMIN), UserController.getUser);

export const UserRoutes = router;
