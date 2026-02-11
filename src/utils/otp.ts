import bcrypt from "bcryptjs";

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOTP = async (otp: string): Promise<string> => {
  return bcrypt.hash(otp, 10);
};

export const verifyOTP = async (
  otp: string,
  hashedOTP: string
): Promise<boolean> => {
  return bcrypt.compare(otp, hashedOTP);
};