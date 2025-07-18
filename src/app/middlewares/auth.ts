import { NextFunction, Request, Response } from "express";
import config from "../config";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { Jwthelper } from "../utils/jwtHelper";
import AppError from "../errors/AppError";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!!");
      }

      const varifiedUser = Jwthelper.verifyToken(
        token as string,
        config.jwt.jwt_scret as string
      ) as JwtPayload;

      if (roles.length && !roles.includes(varifiedUser.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "You are Forbidden!!");
      }

      req.user = varifiedUser;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
