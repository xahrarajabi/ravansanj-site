import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
  }

  const body = await req.json();
  const name = String(body.name || "").trim();
  const answers = Array.isArray(body.answers) ? body.answers : [];
  if (!name) {
    return NextResponse.json({ error: "نام الزامی است" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { name, onboardedAt: new Date() },
  });

  for (const a of answers) {
    if (!a.questionId || !a.value) continue;
    await prisma.demographicAnswer.upsert({
      where: {
        userId_questionId: {
          userId: session.userId,
          questionId: String(a.questionId),
        },
      },
      create: {
        userId: session.userId,
        questionId: String(a.questionId),
        value: String(a.value),
      },
      update: { value: String(a.value) },
    });
  }

  return NextResponse.json({ ok: true });
}
