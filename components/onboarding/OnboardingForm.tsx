"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

const DEMO_OPTIONS: Record<string, string[]> = {
  age_range: ["زیر ۱۸", "۱۸–۲۴", "۲۵–۳۴", "۳۵–۴۴", "۴۵+"],
  gender: ["زن", "مرد", "ترجیح می‌دهم نگویم"],
  education: ["دیپلم", "کاردانی", "کارشناسی", "ارشد و بالاتر", "سایر"],
  goal: ["خودشناسی", "روابط", "کار و مسیر شغلی", "مدیریت هیجان"],
};

type Q = { id: string; key: string; text: string };

export function OnboardingForm({ questions }: { questions: Q[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          answers: questions.map((q) => ({
            questionId: q.id,
            value: answers[q.id] || "",
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>
      <Card className="p-6">
        <h1 className="mb-2 text-xl font-extrabold">آشنایی اولیه</h1>
        <p className="mb-6 text-sm text-text-secondary">
          چند سؤال کوتاه تا تجربه روان‌سنج برای شما شخصی‌تر شود.
        </p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input
            id="name"
            label="نام نمایشی"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {questions.map((q) => (
            <label key={q.id} className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold">{q.text}</span>
              <select
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                value={answers[q.id] || ""}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                }
                required
              >
                <option value="">انتخاب کنید</option>
                {(DEMO_OPTIONS[q.key] || ["سایر"]).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          ))}
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <Button type="submit" disabled={loading} size="lg">
            {loading ? "..." : "ادامه به داشبورد"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
