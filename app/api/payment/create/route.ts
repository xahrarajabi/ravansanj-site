import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { zarinpalRequest } from "@/lib/zarinpal";
import {
  getUnlockKeyFromProduct,
  hasCareer,
  hasFull,
  sanitizeReturnTo,
  userUnlockKeys,
  UNLOCK_KEYS,
} from "@/lib/access";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
  }

  const body = await req.json();
  const slug = String(body.productSlug || "");
  const returnTo = sanitizeReturnTo(body.returnTo);
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.active) {
    return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
  }

  const unlockKey = getUnlockKeyFromProduct(product);
  if (product.kind !== "gift" && unlockKey) {
    const keys = await userUnlockKeys(session.userId);
    const already =
      keys.has(unlockKey) ||
      (unlockKey === UNLOCK_KEYS.careerSuite && hasCareer(keys)) ||
      (unlockKey === UNLOCK_KEYS.fullSuite && hasFull(keys));
    if (already) {
      return NextResponse.json(
        {
          error: "این بسته قبلاً خریداری شده است",
          alreadyOwned: true,
          href: unlockKey === "growth_path" ? "/growth-path" : "/pricing",
        },
        { status: 409 }
      );
    }
  }

  const payment = await prisma.payment.create({
    data: {
      userId: session.userId,
      productId: product.id,
      amount: product.priceToman,
      status: "pending",
    },
  });

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const callback = new URL(`${appUrl}/api/payment/callback`);
  if (returnTo) callback.searchParams.set("returnTo", returnTo);

  try {
    const { authority, paymentUrl } = await zarinpalRequest(
      product.priceToman,
      product.title,
      callback.toString()
    );
    await prisma.payment.update({
      where: { id: payment.id },
      data: { authority },
    });
    return NextResponse.json({
      data: { paymentUrl, authority, paymentId: payment.id },
    });
  } catch (e) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "failed" },
    });
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "خطای پرداخت" },
      { status: 500 }
    );
  }
}
