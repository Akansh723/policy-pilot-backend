import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Insurance Portal API",
      version: "1.0.0",
      description: "API documentation for Insurance Portal Backend",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: env.apiUrl,
        description: env.nodeEnv === "production" ? "Production server" : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            mobile: { type: "string" },
            name: { type: "string" },
            age: { type: "number" },
            gender: { type: "string", enum: ["male", "female", "other"] },
          },
        },
        Vehicle: {
          type: "object",
          properties: {
            id: { type: "string" },
            licencePlate: { type: "string" },
            carName: { type: "string" },
            company: { type: "string" },
            purchaseYear: { type: "number" },
            fuelType: { type: "string", enum: ["petrol", "diesel", "electric", "cng"] },
            usageType: { type: "string", enum: ["personal", "commercial"] },
            insuranceClaimsCount: { type: "number" },
          },
        },
        Policy: {
          type: "object",
          properties: {
            id: { type: "string" },
            category: { type: "string" },
            fuelType: { type: "string", enum: ["petrol", "diesel", "electric", "cng"] },
            usageType: { type: "string", enum: ["personal", "commercial"] },
            purchaseYearGap: { type: "number" },
            basePremium: { type: "number" },
            idvPercentage: { type: "number" },
            claimBonusPercentage: { type: "number" },
            providerName: { type: "string" },
          },
        },
        AddOn: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            code: { type: "string" },
            description: { type: "string" },
            priceType: { type: "string", enum: ["flat", "percentage"] },
            priceValue: { type: "number" },
            maxVehicleAge: { type: "number" },
            applicableForFuel: { type: "array", items: { type: "string", enum: ["petrol", "diesel", "electric", "cng"] } },
          },
        },
        PolicyPurchase: {
          type: "object",
          properties: {
            id: { type: "string" },
            userId: { type: "string" },
            vehicleId: { type: "string" },
            policyId: { type: "string" },
            addons: { type: "array", items: { type: "string" } },
            basePremium: { type: "number" },
            addonsPremium: { type: "number" },
            totalPremium: { type: "number" },
            status: { type: "string", enum: ["REVIEW", "ACTIVE", "CANCELLED", "EXPIRED"] },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            error: { type: "string" },
          },
        },
      },
    },
    security: [],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
