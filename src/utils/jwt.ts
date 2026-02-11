import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const signToken = (payload: object): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as string
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret);
};