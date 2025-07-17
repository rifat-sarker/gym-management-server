import config from "../config";
import { ErrorRequestHandler } from "express";
import AppError from "../errors/AppError";

export type TErrorSources = {
  path: string | number;
  message: string;
}[];

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    stack: config.node_env === "development" ? err?.stack : undefined,
  });
};

export default globalErrorHandler;
