"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TEST_QUESTIONS } from "@/lib/test/questions";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const LABELS = [
  "کاملاً مخالفم",
  "مخالفم",
  "کمی مخالفم",
  "نظری ندارم",
  "کمی موافقم",
  "موافقم",
  "کاملاً موافقم",
];

export function PersonalityTestFlow({
  sessionId,
  initialAnswers,
}: {
  sessionId: string;
  initialAnswers: Record<string, number>;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(() => {
    const first = TEST_QUESTIONS.findIndex((q) => !initialAnswers[q.id]);
    return first === -1 ? 0 : first;
  });
  const [answers, setAnswers] = useState<Record<string, number>>(initialAnswers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const q = TEST_QUESTIONS[index];
  const selected = answers[q.id];

  const tones = useMemo(
    () => [
      "opacity-55",
      "opacity-65",
      "opacity-75",
      "opacity-85",
      "opacity-90",
      "opacity-95",
      "opacity-100",
    ],
    []
  );

  async function pick(score: number) {
    setAnswers((prev) => ({ ...prev, [q.id]: score }));
    void fetch("/api/personality/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, questionId: q.id, score }),
    });
  }

  async function next() {
    if (index < TEST_QUESTIONS.length - 1) {
      setIndex((i) => i + 1);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/personality/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      router.push(`/personality/result/${sessionId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <Card className="p-6 md:p-9">
        <ProgressBar
          current={index + 1}
          total={TEST_QUESTIONS.length}
          className="mb-8"
        />
        <h1 className="mb-8 text-center text-xl font-bold leading-9 text-text md:text-2xl">
          {q.text}
        </h1>

        <div className="likert-track mb-3" role="radiogroup" aria-label="میزان موافقت">
          {LABELS.map((label, i) => {
            const score = i + 1;
            const active = selected === score;
            return (
              <button
                key={score}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={label}
                title={label}
                onClick={() => pick(score)}
                className={`flex h-12 items-center justify-center rounded-2xl border text-xs font-bold transition duration-200 md:h-14 ${
                  active
                    ? `border-primary bg-primary text-white ${tones[i]}`
                    : "border-line bg-surface text-muted hover:border-primary/40 hover:bg-primary-soft"
                }`}
              >
                {score}
              </button>
            );
          })}
        </div>
        <div className="mb-8 flex justify-between text-[11px] font-semibold text-muted">
          <span>مخالفم</span>
          <span>موافقم</span>
        </div>

        {error ? <p className="mb-3 text-sm text-danger">{error}</p> : null}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={index === 0 || loading}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="flex-1"
          >
            قبلی
          </Button>
          <Button
            type="button"
            disabled={!selected || loading}
            onClick={() => void next()}
            className="flex-1"
          >
            {loading
              ? "در حال ذخیره…"
              : index === TEST_QUESTIONS.length - 1
                ? "مشاهده نتیجه"
                : "بعدی"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
