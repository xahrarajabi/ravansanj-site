import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  const sessions = await prisma.testSession.findMany({
    where: { userId: session.userId },
    include: {
      test: { select: { slug: true, title: true, description: true } },
      _count: { select: { answers: true } },
    },
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json({
    data: sessions.map((s) => ({
      id: s.id,
      status: s.status,
      startedAt: s.startedAt,
      completedAt: s.completedAt,
      answerCount: s._count.answers,
      test: s.test,
    })),
  });
}
