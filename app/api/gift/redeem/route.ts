import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyUser } from "@/lib/notify";
import { upsertGrowthPathReport } from "@/lib/report-persist";
import {
  getUnlockKeyFromProduct,
  grantUnlock,
  hrefForUnlockKey,
  UNLOCK_KEYS,
} from "@/lib/access";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
  }

  const body = await req.json();
  const code = String(body.code || "")
    .trim()
    .toUpperCase();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const gift = await tx.giftCode.findUnique({ where: { code } });
      if (!gift || gift.status !== "active") {
        throw new Error("کد نامعتبر است");
      }

      const updated = await tx.giftCode.updateMany({
        where: { id: gift.id, status: "active" },
        data: {
          status: "redeemed",
          redeemerId: session.userId,
          redeemedAt: new Date(),
        },
      });
      if (updated.count === 0) {
        throw new Error("کد قبلاً استفاده شده است");
      }

      const product = gift.productId
        ? await tx.product.findUnique({ where: { id: gift.productId } })
        : null;

      const unlockKey =
        (product && getUnlockKeyFromProduct(product)) || UNLOCK_KEYS.comprehensive;

      await tx.contentUnlock.upsert({
        where: { userId_key: { userId: session.userId, key: unlockKey } },
        create: { userId: session.userId, key: unlockKey },
        update: {},
      });

      return { unlockKey };
    });

    await grantUnlock(session.userId, result.unlockKey);
    if (result.unlockKey === UNLOCK_KEYS.growthPath) {
      await upsertGrowthPathReport(session.userId);
    }

    const href = hrefForUnlockKey(result.unlockKey);
    await notifyUser(
      session.userId,
      "کد هدیه اعمال شد",
      "قابلیت جدید فعال شد.",
      href
    );

    return NextResponse.json({ ok: true, href });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "خطا" },
      { status: 400 }
    );
  }
}
