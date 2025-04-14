import * as Joi from "joi";

export const userSignUpAuthSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(7)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$"))
    .required()
    .messages({
      "string.base": "Password must be a string",
      "string.min": "Password must be at least {#limit} characters long",
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      "any.required": "Password is required",
    }),
});

export const userLoginAuthSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
