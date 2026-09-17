import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
  }

  const body = await req.json();
  const sessionId = String(body.sessionId || "");
  const questionId = String(body.questionId || "");
  const optionId = String(body.optionId || "");
  if (!sessionId || !questionId || !optionId) {
    return NextResponse.json({ error: "داده ناقص" }, { status: 400 });
  }

  const testSession = await prisma.testSession.findFirst({
    where: { id: sessionId, userId: session.userId, status: "in_progress" },
  });
  if (!testSession) {
    return NextResponse.json({ error: "نشست معتبر نیست" }, { status: 404 });
  }

  await prisma.answer.upsert({
    where: { sessionId_questionId: { sessionId, questionId } },
    create: { sessionId, questionId, optionId },
    update: { optionId },
  });

  return NextResponse.json({ ok: true });
}
