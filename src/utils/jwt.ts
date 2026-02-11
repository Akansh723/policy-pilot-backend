import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export const signToken = (payload: object): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  } as SignOptions);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret);
};