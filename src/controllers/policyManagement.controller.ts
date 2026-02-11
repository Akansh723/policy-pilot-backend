import { Request, Response } from "express";
import { Policy } from "../models/policy.model";
import { successResponse } from "../utils/response";

export const getAllPolicies = async (_req: Request, res: Response) => {
  const policies = await Policy.find().sort({ createdAt: -1 });

  return successResponse(res, 200, "Policies fetched successfully", policies);
};