import { Request, Response, NextFunction } from "express";
import redis from "../utils/redis";

const DEFAULT_TTL = 300; // 5 minutes

export const cache = (ttl: number = DEFAULT_TTL, keyFn?: (req: any) => string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = keyFn ? keyFn(req) : `cache:${req.originalUrl}`;
      res.set("Cache-Control", "no-cache, no-store");
      res.removeHeader("ETag");
      const cached = await redis.get(key);

      if (cached) {
        return res.status(200).json(cached);
      }

      const originalJson = res.json.bind(res);
      res.json = ((body: any) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          try {
            const plain = JSON.parse(JSON.stringify(body));
            redis.set(key, plain, { ex: ttl }).catch(console.error);
          } catch (e) {
            console.error("[CACHE] Serialization error:", e);
          }
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
