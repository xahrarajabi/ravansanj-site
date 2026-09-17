import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  const body = await req.json();
  const slug = String(body.slug || "");
  if (!slug) {
    return NextResponse.json({ error: "slug الزامی است" }, { status: 400 });
  }

  const test = await prisma.test.findUnique({ where: { slug } });
  if (!test) {
    return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });
  }

  const existing = await prisma.testSession.findFirst({
    where: {
      userId: session.userId,
      testId: test.id,
      status: "in_progress",
    },
    include: { answers: true },
  });

  if (existing) {
    return NextResponse.json({
      data: {
        sessionId: existing.id,
        resumed: true,
        answers: Object.fromEntries(
          existing.answers.map((a) => [a.questionId, a.optionId])
        ),
      },
    });
  }

  const created = await prisma.testSession.create({
    data: {
      userId: session.userId,
      testId: test.id,
      status: "in_progress",
    },
  });

  return NextResponse.json({
    data: { sessionId: created.id, resumed: false, answers: {} },
  });
}
