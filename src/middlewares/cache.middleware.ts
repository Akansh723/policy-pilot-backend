import { Request, Response, NextFunction } from "express";
import redis from "../utils/redis";

const DEFAULT_TTL = 300; // 5 minutes

export const cache = (ttl: number = DEFAULT_TTL, keyFn?: (req: Request) => string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = keyFn ? keyFn(req) : `cache:${req.originalUrl}`;
      const cached = await redis.get(key);

      if (cached) {
        return res.status(200).json(cached);
      }

      const originalJson = res.json.bind(res);
      res.json = ((body: any) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          redis.set(key, body, { ex: ttl }).catch(() => {});
        }
        return originalJson(body);
      }) as any;

      next();
    } catch {
      next();
    }
  };
};

export const invalidateCache = async (...patterns: string[]) => {
  for (const pattern of patterns) {
    const keys = await redis.keys(pattern);
    if (keys.length) {
      await Promise.all(keys.map((key) => redis.del(key)));
    }
  }
};
