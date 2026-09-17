"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [devHint, setDevHint] = useState("");

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  async function requestOtp(e?: FormEvent) {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ارسال کد ممکن نشد. دوباره تلاش کنید.");
      setStep("otp");
      setSeconds(60);
      setDevHint(data.devCode ? `کد توسعه: ${data.devCode}` : "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطایی رخ داد");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const next =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next")
          : null;
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "کد نامعتبر است");
      router.push(data.redirect || "/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطایی رخ داد");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="soft-glow relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="absolute end-4 top-4">
        <ThemeToggle />
      </div>
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>
      <Card className="p-6 md:p-8">
        <h1 className="mb-2 text-center text-xl font-bold text-text">
          ورود به روان‌سنج
        </h1>
        <p className="mb-7 text-center text-sm leading-7 text-text-secondary">
          با شماره موبایل وارد شوید. حساب در صورت نیاز به‌صورت خودکار ساخته می‌شود.
        </p>

        {step === "phone" ? (
          <form onSubmit={requestOtp} className="flex flex-col gap-4">
            <Input
              id="phone"
              label="شماره موبایل"
              inputMode="numeric"
              placeholder="09123456789"
              dir="ltr"
              className="text-left tracking-wider"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="tel"
            />
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? "در حال ارسال..." : "دریافت کد تأیید"}
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="flex flex-col gap-4">
            <p className="text-center text-sm text-text-secondary">
              کد ۶ رقمی به <span dir="ltr">{phone}</span> ارسال شد
            </p>
            <Input
              id="otp"
              label="کد تأیید"
              inputMode="numeric"
              placeholder="••••••"
              dir="ltr"
              className="text-center text-2xl tracking-[0.4em]"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              autoComplete="one-time-code"
            />
            {devHint ? (
              <p className="rounded-2xl bg-warning/10 px-3 py-2 text-center text-xs text-warning">
                {devHint} (حالت توسعه — پیامک واقعی فعال نیست)
              </p>
            ) : null}
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button
              type="submit"
              disabled={loading || code.length !== 6}
              size="lg"
              className="w-full"
            >
              {loading ? "در حال بررسی..." : "ورود"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={seconds > 0 || loading}
              onClick={() => requestOtp()}
              className="w-full"
            >
              {seconds > 0 ? `ارسال مجدد (${seconds})` : "ارسال مجدد کد"}
            </Button>
            <button
              type="button"
              className="text-sm text-text-secondary hover:text-primary"
              onClick={() => {
                setStep("phone");
                setCode("");
                setError("");
              }}
            >
              تغییر شماره
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}
