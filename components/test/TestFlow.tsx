"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

type Option = { id: string; text: string; score: number };
type Question = {
  id: string;
  order: number;
  text: string;
  trait: string;
  options: Option[];
};

type Props = {
  sessionId: string;
  slug: string;
  title: string;
  questions: Question[];
  initialAnswers?: Record<string, string>;
};

export function TestProgress({ current, total }: { current: number; total: number }) {
  return <ProgressBar current={current} total={total} className="mb-6" />;
}

export function TestFlow({ sessionId, title, questions, initialAnswers = {} }: Props) {
  const router = useRouter();
  const sorted = useMemo(
    () => [...questions].sort((a, b) => a.order - b.order),
    [questions]
  );
  const [index, setIndex] = useState(() => {
    const firstUnanswered = sorted.findIndex((q) => !initialAnswers[q.id]);
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  });
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const current = sorted[index];
  const selected = answers[current?.id];

  async function selectOption(optionId: string) {
    setAnswers((prev) => ({ ...prev, [current.id]: optionId }));
    try {
      await fetch("/api/participation/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: current.id,
          optionId,
        }),
      });
    } catch {
      // keep local answer even if network fails; completion will persist
    }
  }

  async function finish() {
    setLoading(true);
    setError("");
    try {
      const payload = Object.entries(answers).map(([questionId, optionId]) => ({
        questionId,
        optionId,
      }));
      const res = await fetch("/api/participation/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, answers: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در ثبت نتیجه");
      const reportId = data.data?.reportId;
      router.push(reportId ? `/reports/${reportId}` : `/result/${sessionId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا");
      setLoading(false);
    }
  }

  function next() {
    if (index < sorted.length - 1) {
      setIndex((i) => i + 1);
    } else {
      void finish();
    }
  }

  if (!current) {
    return <p className="text-center text-text-secondary">سؤالی یافت نشد.</p>;
  }

  return (
    <Card className="mx-auto max-w-xl p-6 md:p-9">
      <p className="mb-1 text-xs font-bold text-primary">{title}</p>
      <TestProgress current={index + 1} total={sorted.length} />
      <h2 className="mb-7 text-lg font-bold leading-9 text-text md:text-xl">
        {current.text}
      </h2>
      <div className="mb-7 flex flex-col gap-2.5" role="radiogroup" aria-label="گزینه‌های پاسخ">
        {current.options.map((opt) => {
          const active = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => selectOption(opt.id)}
              className={`min-h-12 rounded-2xl border px-4 py-3.5 text-right text-[0.95rem] font-medium transition duration-200 ${
                active
                  ? "border-primary bg-primary-soft text-primary shadow-sm"
                  : "border-line bg-surface text-text hover:border-primary/40 hover:bg-primary-soft/50"
              }`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
      {error ? <p className="mb-3 text-sm text-danger">{error}</p> : null}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          disabled={index === 0 || loading}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="flex-1"
        >
          قبلی
        </Button>
        <Button disabled={!selected || loading} onClick={next} className="flex-1">
          {loading
            ? "در حال ذخیره..."
            : index === sorted.length - 1
              ? "مشاهده نتیجه"
              : "بعدی"}
        </Button>
      </div>
    </Card>
  );
}
