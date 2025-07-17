import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import config from "../config";

const notFound = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    status: httpStatus.NOT_FOUND,
    message: "API is not found",
    stack: config.node_env === "development" ? new Error().stack : undefined,
  });
};

export default notFound;
