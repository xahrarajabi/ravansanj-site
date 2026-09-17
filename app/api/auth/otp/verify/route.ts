import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  mergeGuestSessions,
  normalizeIranPhone,
  readGuestId,
  setSessionCookie,
} from "@/lib/auth";
import { OTP_MAX_ATTEMPTS, verifyOtpHash } from "@/lib/otp";
import { sanitizeReturnTo } from "@/lib/access";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = normalizeIranPhone(String(body.phone || ""));
    const code = String(body.code || "").trim();
    const next = sanitizeReturnTo(body.next);

    if (!phone || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "اطلاعات نامعتبر است" }, { status: 400 });
    }

    const otp = await prisma.otpCode.findFirst({
      where: { phone },
      orderBy: { createdAt: "desc" },
    });

    if (!otp || otp.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "کد نامعتبر یا منقضی شده است" },
        { status: 400 }
      );
    }

    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      await prisma.otpCode.deleteMany({ where: { phone } });
      return NextResponse.json(
        { error: "تعداد تلاش بیش از حد. دوباره کد بگیرید." },
        { status: 429 }
      );
    }

    if (!verifyOtpHash(phone, code, otp.codeHash)) {
      await prisma.otpCode.update({
        where: { id: otp.id },
        data: { attempts: otp.attempts + 1 },
      });
      return NextResponse.json(
        { error: "کد نامعتبر یا منقضی شده است" },
        { status: 400 }
      );
    }

    await prisma.otpCode.deleteMany({ where: { phone } });

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({ data: { phone } });
    }

    const guestId = await readGuestId();
    await mergeGuestSessions(user.id, guestId);

    const token = await createSessionToken(user.id, user.phone);
    await setSessionCookie(token);

    const defaultRedirect = user.onboardedAt ? "/dashboard" : "/onboarding";

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        phone: user.phone,
        onboarded: Boolean(user.onboardedAt),
      },
      redirect: next || defaultRedirect,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطا در ورود" }, { status: 500 });
  }
}
