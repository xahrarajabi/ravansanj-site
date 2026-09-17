import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { zarinpalVerify } from "@/lib/zarinpal";
import { notifyUser } from "@/lib/notify";
import { upsertGrowthPathReport } from "@/lib/report-persist";
import {
  getUnlockKeyFromProduct,
  grantUnlock,
  hrefForUnlockKey,
  sanitizeReturnTo,
  UNLOCK_KEYS,
} from "@/lib/access";

function successUrl(
  appUrl: string,
  opts: {
    kind?: string | null;
    unlockKey?: string | null;
    returnTo?: string | null;
  }
) {
  if (opts.returnTo) {
    const sep = opts.returnTo.includes("?") ? "&" : "?";
    return `${appUrl}${opts.returnTo}${sep}pay=ok`;
  }
  if (opts.kind === "gift") {
    return `${appUrl}/settings?pay=ok&gift=1`;
  }
  if (opts.unlockKey === UNLOCK_KEYS.growthPath) {
    return `${appUrl}/growth-path?pay=ok`;
  }
  if (opts.unlockKey === UNLOCK_KEYS.comprehensive) {
    return `${appUrl}/reports?pay=ok`;
  }
  return `${appUrl}/settings?pay=ok`;
}

export async function GET(req: NextRequest) {
  const authority = req.nextUrl.searchParams.get("Authority") || "";
  const status = req.nextUrl.searchParams.get("Status") || "";
  const returnTo = sanitizeReturnTo(req.nextUrl.searchParams.get("returnTo"));
  const appUrl = process.env.APP_URL || "http://localhost:3000";

  const payment = await prisma.payment.findFirst({
    where: { authority },
    include: { product: true },
  });

  if (!payment) {
    return NextResponse.redirect(`${appUrl}/settings?pay=missing`);
  }

  const unlockKey = payment.product
    ? getUnlockKeyFromProduct(payment.product)
    : null;
  const redirectOk = () =>
    NextResponse.redirect(
      successUrl(appUrl, {
        kind: payment.product?.kind,
        unlockKey,
        returnTo,
      })
    );

  if (payment.status === "paid") {
    if (unlockKey) {
      await grantUnlock(payment.userId, unlockKey);
      if (unlockKey === UNLOCK_KEYS.growthPath) {
        await upsertGrowthPathReport(payment.userId);
      }
    }
    return redirectOk();
  }

  if (status !== "OK") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "canceled" },
    });
    return NextResponse.redirect(`${appUrl}/settings?pay=canceled`);
  }

  const verify = await zarinpalVerify(authority, payment.amount);
  if (!verify.ok) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "failed" },
    });
    return NextResponse.redirect(`${appUrl}/settings?pay=failed`);
  }

  let giftCode: string | null = null;

  await prisma.$transaction(async (tx) => {
    const latest = await tx.payment.findUnique({ where: { id: payment.id } });
    if (latest?.status === "paid") return;

    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "paid", refId: verify.refId, paidAt: new Date() },
    });

    if (!payment.product) return;

    if (payment.product.kind === "gift") {
      const existing = await tx.giftCode.findFirst({
        where: { paymentId: payment.id },
      });
      if (existing) {
        giftCode = existing.code;
        return;
      }
      const code = randomBytes(4).toString("hex").toUpperCase();
      await tx.giftCode.create({
        data: {
          code,
          productId: payment.product.id,
          ownerId: payment.userId,
          paymentId: payment.id,
          status: "active",
        },
      });
      giftCode = code;
      return;
    }

    if (!unlockKey) return;


    await tx.contentUnlock.upsert({
      where: {
        userId_key: { userId: payment.userId, key: unlockKey },
      },
      create: { userId: payment.userId, key: unlockKey },
      update: {},
    });

    if (unlockKey === UNLOCK_KEYS.comprehensive) {
      await tx.report.updateMany({
        where: { userId: payment.userId, type: "comprehensive" },
        data: { unlocked: true },
      });
    }
    if (unlockKey === UNLOCK_KEYS.growthPath) {
      await tx.report.updateMany({
        where: { userId: payment.userId, type: "growth_path" },
        data: { unlocked: true },
      });
    }
  });

  if (payment.product?.kind === "gift") {
    if (!giftCode) {
      const created = await prisma.giftCode.findFirst({
        where: { paymentId: payment.id },
        orderBy: { createdAt: "desc" },
      });
      giftCode = created?.code ?? null;
    }
    if (giftCode) {
      await notifyUser(
        payment.userId,
        "کد هدیه آماده است",
        `کد شما: ${giftCode}`,
        "/settings"
      );
    }
  } else if (unlockKey) {
    if (unlockKey === UNLOCK_KEYS.growthPath) {
      await upsertGrowthPathReport(payment.userId);
    }
    await notifyUser(
      payment.userId,
      "خرید موفق",
      `${payment.product?.title || "بسته"} فعال شد.`,
      hrefForUnlockKey(unlockKey)
    );
  }

  return redirectOk();
}
