import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { usersService } from "./users.service";
import { handleErrorIn } from "../common/errors";
import { ResponseStatus } from "../common/common.types";

export const userSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("User signing up");
    const { email, password } = req.body;
    await usersService.createUser(email, password, null, "USER");
    res
      .status(ResponseStatus.CREATED)
      .json({ message: "Successfully signed up" });
  } catch (error) {
    handleErrorIn("User Sign Up", next)(error);
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("User logging in");
    const { email, password } = req.body;
    const { token, user } = await usersService.userLogin(email, password);
    res.status(ResponseStatus.SUCCESS).json({ token, user });
  } catch (error) {
    handleErrorIn("User Login", next)(error);
  }
};
