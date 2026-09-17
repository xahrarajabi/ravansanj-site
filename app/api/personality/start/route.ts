import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateGuestId, getSession } from "@/lib/auth";

export async function POST() {
  const guestId = await getOrCreateGuestId();
  const session = await getSession();
  const row = await prisma.personalitySession.create({
    data: { guestId, userId: session?.userId ?? null },
  });
  return NextResponse.json({ data: { sessionId: row.id } });
}
