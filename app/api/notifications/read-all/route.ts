import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });

  await prisma.notification.updateMany({
    where: { userId: session.userId, read: false },
    data: { read: true },
  });
  return NextResponse.json({ ok: true });
}
