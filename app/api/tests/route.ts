import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tests = await prisma.test.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      _count: { select: { questions: true } },
    },
    orderBy: { title: "asc" },
  });

  return NextResponse.json({
    data: tests.map((t) => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      description: t.description,
      questionCount: t._count.questions,
    })),
  });
}
