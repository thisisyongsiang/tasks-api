import * as Joi from "joi";
import { ResponseStatus } from "../common/common.types";

// This function is a middleware for validating request bodies using Joi.
export const requestBodyValidator = (schema: Joi.Schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res
        .status(ResponseStatus.BAD_REQUEST)
        .json({ message: error.details[0].message });
    }
    req.body = value;
    next();
  };
};
