import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, readGuestId } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sessionId = String(body.sessionId || "");
  const questionId = String(body.questionId || "");
  const score = Number(body.score);
  if (!sessionId || !questionId || score < 1 || score > 7) {
    return NextResponse.json({ error: "نامعتبر" }, { status: 400 });
  }

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
  if (row.status === "completed") {
    return NextResponse.json({ error: "این آزمون قبلاً تکمیل شده" }, { status: 400 });
  }

  let answers: Record<string, number> = {};
  try {
    answers = JSON.parse(row.answersJson || "{}") as Record<string, number>;
  } catch {
    answers = {};
  }
  answers[questionId] = score;
  await prisma.personalitySession.update({
    where: { id: row.id },
    data: { answersJson: JSON.stringify(answers) },
  });
  return NextResponse.json({ ok: true });
}
