import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import { expressjwt } from "express-jwt";
import { ResponseStatus } from "../common/common.types";
config();

export const authGuard = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

export const adminGuard = (req: Request, res: Response, next: NextFunction) => {
  if (req.auth.role !== "ADMIN") {
    res.status(ResponseStatus.FORBIDDEN).send({ message: "Forbidden" });
  } else {
    next();
  }
};
