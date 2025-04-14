import { Response, Request, NextFunction } from "express";
import { logger } from "../utils/logger";
import { ApiError, InternalError } from "./errors";

const handleError = (err: ApiError, req: Request, res: Response): Response => {
  logger.error(
    `App Error Handler, Path: ${req.path}, Message: ${err?.message}, Status: ${err?.httpStatusCode}`,
    err
  );
  return res.status(err.httpStatusCode).json({ message: err.message });
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    handleError(err, req, res);
  } else {
    handleError(new InternalError(err.message), req, res);
  }
};
