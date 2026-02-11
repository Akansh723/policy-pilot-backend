import twilio from "twilio";
import { env } from "../config/env";

const getTwilioClient = () => {
  if (!env.twilioAccountSid || !env.twilioAuthToken) {
    throw new Error("Twilio credentials not configured");
  }
  return twilio(env.twilioAccountSid, env.twilioAuthToken);
};

export const sendOTPSMS = async (mobile: string, otp: string): Promise<void> => {
  try {
    const client = getTwilioClient();
    await client.messages.create({
      body: `Your OTP for PolicyPilot is: ${otp}. Valid for 5 minutes.`,
      from: env.twilioPhoneNumber,
      to: `+91${mobile}`
    });
    console.log(`OTP sent successfully to +91${mobile}`);
  } catch (error) {
    console.error("Twilio SMS Error:", error);
    throw new Error("Failed to send OTP");
  }
};