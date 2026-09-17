import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, readGuestId } from "@/lib/auth";
import { scoreAnswers } from "@/lib/personality/scoring";
import { TEST_QUESTIONS } from "@/lib/test/questions";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sessionId = String(body.sessionId || "");
  const incoming = (body.answers || {}) as Record<string, number>;
  const auth = await getSession();
  const guestId = await readGuestId();

  const row = await prisma.personalitySession.findFirst({
    where: {
      id: sessionId,
      OR: [
        ...(guestId ? [{ guestId }] : []),
        ...(auth ? [{ userId: auth.userId }] : []),
      ],
    },
  });
  if (!row) return NextResponse.json({ error: "نشست یافت نشد" }, { status: 404 });

  const answers: Record<string, number> = {};
  for (const q of TEST_QUESTIONS) {
    const v = Number(incoming[q.id]);
    if (v >= 1 && v <= 7) answers[q.id] = v;
  }
  if (Object.keys(answers).length < TEST_QUESTIONS.length) {
    return NextResponse.json({ error: "همهٔ سؤالات را پاسخ دهید" }, { status: 400 });
  }

  const result = scoreAnswers(answers);
  await prisma.personalitySession.update({
    where: { id: row.id },
    data: {
      status: "completed",
      completedAt: new Date(),
      answersJson: JSON.stringify(answers),
      resultJson: JSON.stringify(result),
      typeCode: result.typeCode,
      ...(auth && !row.userId ? { userId: auth.userId } : {}),
    },
  });
  return NextResponse.json({ ok: true, data: { typeCode: result.typeCode } });
}
