import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });

  const body = await req.json();
  const targetUsername = String(body.username || "");
  const action = String(body.action || "follow");

  const me = await prisma.socialProfile.findUnique({ where: { userId: session.userId } });
  const target = await prisma.socialProfile.findUnique({ where: { username: targetUsername } });
  if (!me || !target) {
    return NextResponse.json({ error: "پروفایل یافت نشد" }, { status: 404 });
  }
  if (me.id === target.id) {
    return NextResponse.json({ error: "نامعتبر" }, { status: 400 });
  }

  if (action === "like") {
    await prisma.like.upsert({
      where: { likerId_likedId: { likerId: me.id, likedId: target.id } },
      create: { likerId: me.id, likedId: target.id },
      update: {},
    });
  } else {
    await prisma.follow.upsert({
      where: { followerId_followingId: { followerId: me.id, followingId: target.id } },
      create: { followerId: me.id, followingId: target.id },
      update: {},
    });
  }

  return NextResponse.json({ ok: true });
}
