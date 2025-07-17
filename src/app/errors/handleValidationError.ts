import { ZodError } from "zod";
import { TErrorSources } from "../types/error";

const handleZodValidationError = (err: ZodError) => {
  const errorSources: TErrorSources = err.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: "Validation error",
    errorSources,
  };
};

export default handleZodValidationError;
