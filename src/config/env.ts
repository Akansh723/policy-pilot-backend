import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 8080,
  apiUrl: process.env.API_URL || `http://localhost:${Number(process.env.PORT) || 8080}`,
  mongoUri: process.env.MONGO_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID as string,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN as string,
twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER as string,
corsOrigin: process.env.FRONTEND as string
};