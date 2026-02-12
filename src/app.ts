import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth.route";
import vehicleRoutes from "./routes/vehicle.route";
import addPolicyRoutes from "./routes/addPolicy.route";
import suggestPolicyRoutes from "./routes/policy-suggestion.route";
import addAddOnsRoutes from "./routes/addon.route";
import userPolicyRoutes from "./routes/buy-policy.route";
import userRoutes from "./routes/user.route";

import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middlewares/error.middleware";
import healthRoute from "./routes/health.route";

export const createApp = (): Application => {
  const app = express();

  // Security & core middlewares
  app.use(cors({
    origin: env.corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (env.nodeEnv === "development") {
    app.use(morgan("dev"));
  }

  // Swagger documentation
  const swaggerServe = swaggerUi.serve as any;
  const swaggerSetup = swaggerUi.setup(swaggerSpec) as any;
  app.use("/api-docs", swaggerServe, swaggerSetup);

  // Routes
  app.use("/health", healthRoute);
  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);
  app.use("/vehicle", vehicleRoutes);
  app.use("/add-policy", addPolicyRoutes);
  app.use("/policies", suggestPolicyRoutes);
  app.use("/policy",userPolicyRoutes );
  app.use("/addOns/add", addAddOnsRoutes);
  
  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};