"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";

type Q = {
  id: string;
  text: string;
  options: { id: string; text: string }[];
};

export default function InvitePublicPage() {
  const params = useParams();
  const token = String(params.token || "");
  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/invites/${token}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا");
        setLoading(false);
        return;
      }
      setQuestions(data.data.test.questions || []);
      setLoading(false);
    }
    void load();
  }, [token]);

  async function submit() {
    const payload = Object.entries(answers).map(([questionId, optionId]) => ({
      questionId,
      optionId,
    }));
    if (payload.length < questions.length) {
      setError("همه سؤالات را پاسخ دهید");
      return;
    }
    const res = await fetch(`/api/invites/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: payload }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "خطا");
      return;
    }
    setDone(true);
  }

  if (loading) {
    return <p className="p-10 text-center">در حال بارگذاری...</p>;
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Logo className="mb-6 justify-center" />
        <h1 className="text-xl font-extrabold">متشکریم</h1>
        <p className="mt-2 text-sm text-text-secondary">پاسخ شما ثبت شد.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Logo className="mb-6" />
      <Card className="p-6">
        <h1 className="mb-4 text-lg font-extrabold">پرسشنامه نگاه دیگران</h1>
        {questions.map((q) => (
          <div key={q.id} className="mb-5">
            <p className="mb-2 text-sm font-semibold">{q.text}</p>
            <div className="flex flex-col gap-2">
              {q.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setAnswers((p) => ({ ...p, [q.id]: o.id }))}
                  className={`rounded-xl border px-3 py-2 text-right text-sm ${
                    answers[q.id] === o.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200"
                  }`}
                >
                  {o.text}
                </button>
              ))}
            </div>
          </div>
        ))}
        {error ? <p className="mb-3 text-sm text-red-500">{error}</p> : null}
        <Button className="w-full" onClick={submit}>
          ثبت پاسخ
        </Button>
      </Card>
    </div>
  );
}
