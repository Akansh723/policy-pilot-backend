import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        mobile: string;
        name?: string;
      };
    }
  }
}

export {};