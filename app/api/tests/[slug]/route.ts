import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const test = await prisma.test.findUnique({
    where: { slug },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: { options: { orderBy: { score: "asc" } } },
      },
    },
  });

  if (!test) {
    return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });
  }

  return NextResponse.json({ data: test });
}
