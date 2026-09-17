import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyUser } from "@/lib/notify";
import { recomputeLatestSessionForTest } from "@/lib/report-persist";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const invite = await prisma.invite.findUnique({
    where: { token },
    include: {
      test: {
        include: {
          questions: {
            where: { perspective: "other" },
            orderBy: { order: "asc" },
            include: { options: { orderBy: { score: "asc" } } },
          },
        },
      },
      inviter: { select: { name: true, phone: true } },
    },
  });
  if (!invite) return NextResponse.json({ error: "دعوت یافت نشد" }, { status: 404 });
  return NextResponse.json({ data: invite });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const invite = await prisma.invite.findUnique({
    where: { token },
    include: { test: { include: { questions: true } } },
  });
  if (!invite || invite.status === "completed") {
    return NextResponse.json({ error: "دعوت معتبر نیست" }, { status: 400 });
  }

  const body = await req.json();
  const answers = Array.isArray(body.answers) ? body.answers : [];
  for (const a of answers) {
    await prisma.contributorResponse.upsert({
      where: {
        inviteId_questionId: {
          inviteId: invite.id,
          questionId: String(a.questionId),
        },
      },
      create: {
        inviteId: invite.id,
        questionId: String(a.questionId),
        optionId: String(a.optionId),
      },
      update: { optionId: String(a.optionId) },
    });
  }

  await prisma.invite.update({
    where: { id: invite.id },
    data: { status: "completed", completedAt: new Date() },
  });

  const sessionId = await recomputeLatestSessionForTest(
    invite.inviterId,
    invite.testId
  );

  await notifyUser(
    invite.inviterId,
    "بازخورد جدید",
    "یکی از دعوت‌شدگان پرسشنامه را تکمیل کرد. گزارش شما به‌روز شد.",
    sessionId ? `/result/${sessionId}` : "/invites"
  );

  return NextResponse.json({ ok: true });
}
