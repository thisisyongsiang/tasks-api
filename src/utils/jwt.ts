import { config } from "dotenv";
import * as jwt from "jsonwebtoken";

config();

export const generateToken = (payload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h",
    algorithm: "HS256",
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // invalid token or expired token
    return null;
  }
};
