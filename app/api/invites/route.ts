import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeIranPhone } from "@/lib/auth";
import { sendTransactionalSms } from "@/lib/sms";
import { notifyUser } from "@/lib/notify";
import { randomBytes } from "crypto";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });

  const invites = await prisma.invite.findMany({
    where: { inviterId: session.userId },
    include: { test: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data: invites });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });

  const body = await req.json();
  const phone = normalizeIranPhone(String(body.phone || ""));
  const testSlug = String(body.testSlug || "relationship-style");
  if (!phone) {
    return NextResponse.json({ error: "شماره معتبر نیست" }, { status: 400 });
  }

  const test = await prisma.test.findUnique({ where: { slug: testSlug } });
  if (!test) return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });

  const token = randomBytes(16).toString("hex");
  const invite = await prisma.invite.create({
    data: {
      token,
      inviterId: session.userId,
      testId: test.id,
      inviteePhone: phone,
    },
  });

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const link = `${appUrl}/invite/${token}`;
  await sendTransactionalSms(phone, `روان‌سنج: لینک پاسخ به دعوت ۳۶۰ درجه: ${link}`);

  await notifyUser(
    session.userId,
    "دعوت ارسال شد",
    `دعوت برای ${phone} ثبت شد.`,
    "/invites"
  );

  return NextResponse.json({ data: { id: invite.id, token, link } });
}
