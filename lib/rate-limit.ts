import { prisma } from "./prisma";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const MAX_VERIFY_ATTEMPTS = 5;

export async function assertOtpAllowed(phone: string) {
  const now = new Date();
  const row = await prisma.otpRateLimit.findUnique({ where: { phone } });
  if (!row) {
    await prisma.otpRateLimit.create({
      data: { phone, count: 1, windowStart: now },
    });
    return;
  }

  const elapsed = now.getTime() - row.windowStart.getTime();
  if (elapsed > WINDOW_MS) {
    await prisma.otpRateLimit.update({
      where: { phone },
      data: { count: 1, windowStart: now },
    });
    return;
  }

  if (row.count >= MAX_REQUESTS_PER_WINDOW) {
    throw new Error("تعداد درخواست کد بیش از حد مجاز است. کمی بعد دوباره تلاش کنید.");
  }

  await prisma.otpRateLimit.update({
    where: { phone },
    data: { count: row.count + 1 },
  });
}

export { MAX_VERIFY_ATTEMPTS };
