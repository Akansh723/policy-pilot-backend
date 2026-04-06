import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

export const generateCsrfToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const verifyCsrf = (req: Request, res: Response, next: NextFunction) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  const cookieToken = req.cookies?.["csrf-token"];
  const headerToken = req.headers["x-csrf-token"];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ success: false, message: "Invalid CSRF token" });
  }

  next();
};
