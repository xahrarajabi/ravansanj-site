/**
 * ZarinPal payment client.
 * Amounts in our DB are stored in Tomans; ZarinPal v4 expects Rials (×10).
 */

const MERCHANT = () => process.env.ZARINPAL_MERCHANT_ID || "";

export function paymentsInDevMode() {
  return !MERCHANT();
}

function tomanToRial(toman: number) {
  return toman * 10;
}

function gatewayBase() {
  // Sandbox when ZARINPAL_SANDBOX=true
  if (process.env.ZARINPAL_SANDBOX === "true") {
    return {
      request: "https://sandbox.zarinpal.com/pg/v4/payment/request.json",
      verify: "https://sandbox.zarinpal.com/pg/v4/payment/verify.json",
      startPay: "https://sandbox.zarinpal.com/pg/StartPay/",
    };
  }
  return {
    request: "https://api.zarinpal.com/pg/v4/payment/request.json",
    verify: "https://api.zarinpal.com/pg/v4/payment/verify.json",
    startPay: "https://www.zarinpal.com/pg/StartPay/",
  };
}

export async function zarinpalRequest(
  amountToman: number,
  description: string,
  callbackUrl: string
) {
  if (paymentsInDevMode()) {
    const authority = `DEV-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const url = new URL(`${appUrl}/api/payment/callback`);
    // Preserve returnTo already on callbackUrl
    try {
      const incoming = new URL(callbackUrl);
      incoming.searchParams.forEach((v, k) => url.searchParams.set(k, v));
    } catch {
      /* ignore */
    }
    url.searchParams.set("Authority", authority);
    url.searchParams.set("Status", "OK");
    url.searchParams.set("dev", "1");
    return { authority, paymentUrl: url.toString() };
  }

  const gw = gatewayBase();
  const res = await fetch(gw.request, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: MERCHANT(),
      amount: tomanToRial(amountToman),
      callback_url: callbackUrl,
      description,
    }),
  });
  const data = await res.json();
  if (data?.data?.authority) {
    return {
      authority: data.data.authority as string,
      paymentUrl: `${gw.startPay}${data.data.authority}`,
    };
  }
  throw new Error(data?.errors?.message || "خطا در ایجاد پرداخت");
}

export async function zarinpalVerify(authority: string, amountToman: number) {
  // Only allow DEV authorities when merchant is unset
  if (paymentsInDevMode()) {
    if (!authority.startsWith("DEV-")) {
      return { ok: false, refId: null };
    }
    return { ok: true, refId: `DEV-REF-${Date.now()}` };
  }

  if (authority.startsWith("DEV-")) {
    return { ok: false, refId: null };
  }

  const gw = gatewayBase();
  const res = await fetch(gw.verify, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: MERCHANT(),
      amount: tomanToRial(amountToman),
      authority,
    }),
  });
  const data = await res.json();
  const code = data?.data?.code;
  // 100 = first verify, 101 = already verified
  if (code === 100 || code === 101) {
    return { ok: true, refId: String(data.data.ref_id) };
  }
  return { ok: false, refId: null };
}
