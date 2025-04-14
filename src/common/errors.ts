import { NextFunction } from "express";
import { logger } from "../utils/logger";
import { ResponseStatus } from "./common.types";

enum ErrorType {
  UNAUTHORIZED = "AuthFailureError",
  INTERNAL = "InternalError",
  NOT_FOUND = "NotFoundError",
  BAD_REQUEST = "BadRequestError",
  FORBIDDEN = "ForbiddenError",
  CONFLICT = "ConflictError",
}

export abstract class ApiError extends Error {
  constructor(
    public type: ErrorType,
    public message: string = "error",
    public httpStatusCode: number
  ) {
    super(type);
  }
}

export class GenericApiError extends ApiError {
  constructor(
    message = "Bad Request Error",
    httpStatusCode: number = ResponseStatus.BAD_REQUEST
  ) {
    super(ErrorType.BAD_REQUEST, message, httpStatusCode);
  }
}

export class AuthFailureError extends ApiError {
  constructor(message = "Invalid Auth Token") {
    super(ErrorType.UNAUTHORIZED, message, ResponseStatus.UNAUTHORIZED);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = "Bad Request") {
    super(ErrorType.BAD_REQUEST, message, ResponseStatus.BAD_REQUEST);
  }
}
export class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(ErrorType.NOT_FOUND, message, ResponseStatus.NOT_FOUND);
  }
}

export class InternalError extends ApiError {
  constructor(message = "Internal error") {
    super(ErrorType.INTERNAL, message, ResponseStatus.INTERNAL_ERROR);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Permission denied") {
    super(ErrorType.FORBIDDEN, message, ResponseStatus.FORBIDDEN);
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Conflict") {
    super(ErrorType.CONFLICT, message, ResponseStatus.CONFLICT);
  }
}

export const handleErrorIn = (ref: string, next: NextFunction) => (error) => {
  logger.error(
    `Failure in ${ref} Error: ${error?.message}, Status: ${error?.httpStatusCode}`
  );
  next(error);
};
