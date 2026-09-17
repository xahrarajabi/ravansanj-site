import { createHash, randomInt, timingSafeEqual } from "crypto";

const OTP_PEPPER = () => process.env.OTP_PEPPER || process.env.JWT_SECRET || "dev-otp-pepper";

/** Cryptographically secure 6-digit OTP */
export function generateOtp(): string {
  return String(randomInt(100000, 1000000));
}

export function hashOtp(phone: string, code: string): string {
  return createHash("sha256")
    .update(`${OTP_PEPPER()}:${phone}:${code}`)
    .digest("hex");
}

export function verifyOtpHash(phone: string, code: string, storedHash: string): boolean {
  const incoming = Buffer.from(hashOtp(phone, code), "hex");
  const stored = Buffer.from(storedHash, "hex");
  if (incoming.length !== stored.length) return false;
  return timingSafeEqual(incoming, stored);
}

export const OTP_TTL_MS = 5 * 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;
