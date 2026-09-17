"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

type Invite = {
  id: string;
  inviteePhone: string;
  status: string;
  token: string;
  test: { title: string; slug: string };
};

export function InvitesClient({ tests }: { tests: { slug: string; title: string }[] }) {
  const [phone, setPhone] = useState("");
  const [testSlug, setTestSlug] = useState(tests[0]?.slug || "");
  const [list, setList] = useState<Invite[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/invites");
    const data = await res.json();
    setList(data.data || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, testSlug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setMsg(`لینک دعوت: ${data.data.link}`);
      setPhone("");
      await load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "خطا");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Logo />
        <Link href="/dashboard" className="text-sm text-primary">
          داشبورد
        </Link>
      </div>
      <Card className="mb-6 p-6">
        <h1 className="mb-2 text-xl font-extrabold">دعوت ۳۶۰ درجه</h1>
        <p className="mb-4 text-sm text-text-secondary">
          از نزدیکان بخواهید پرسشنامه کوتاه «نگاه دیگران» را پر کنند.
        </p>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <Input
            id="phone"
            label="شماره موبایل دعوت‌شونده"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0912..."
            required
          />
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            آزمون مرتبط
            <select
              className="rounded-xl border border-gray-200 px-4 py-3"
              value={testSlug}
              onChange={(e) => setTestSlug(e.target.value)}
            >
              {tests.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.title}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" disabled={loading}>
            {loading ? "..." : "ارسال دعوت"}
          </Button>
        </form>
        {msg ? <p className="mt-3 break-all text-xs text-text-secondary">{msg}</p> : null}
      </Card>
      <div className="flex flex-col gap-3">
        {list.map((inv) => (
          <Card key={inv.id} className="p-4 text-sm">
            <p className="font-bold" dir="ltr">
              {inv.inviteePhone}
            </p>
            <p className="text-text-secondary">{inv.test.title}</p>
            <p className="text-xs text-primary">{inv.status === "completed" ? "تکمیل‌شده" : "در انتظار"}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
