import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeIranPhone } from "@/lib/auth";
import { sendOtpSms, smsInDevMode } from "@/lib/sms";
import { assertOtpAllowed } from "@/lib/rate-limit";
import { generateOtp, hashOtp, OTP_TTL_MS } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    let body: { phone?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "درخواست نامعتبر است" }, { status: 400 });
    }
    const phone = normalizeIranPhone(String(body.phone || ""));
    if (!phone) {
      return NextResponse.json(
        { error: "شماره موبایل معتبر نیست (مثال: 09123456789)" },
        { status: 400 }
      );
    }

    try {
      await assertOtpAllowed(phone);
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "محدودیت ارسال" },
        { status: 429 }
      );
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await prisma.otpCode.deleteMany({ where: { phone } });
    await prisma.otpCode.create({
      data: {
        phone,
        codeHash: hashOtp(phone, code),
        attempts: 0,
        expiresAt,
      },
    });
    await sendOtpSms(phone, code);

    return NextResponse.json({
      ok: true,
      message: "کد ارسال شد",
      ...(smsInDevMode() ? { devCode: code } : {}),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطا در ارسال کد" }, { status: 500 });
  }
}
