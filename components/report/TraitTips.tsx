import type { TipPayload } from "@/lib/report-builder";

export function TraitTips({ tips }: { tips: TipPayload[] }) {
  return (
    <div className="mb-8">
      <h2 className="mb-3 text-sm font-extrabold text-text">تمرین‌های روزانه</h2>
      <div className="flex flex-col gap-3">
        {tips.map((tip) => (
          <div
            key={tip.traitKey}
            className="rounded-2xl border border-gray-100 bg-white p-4"
          >
            <p className="mb-1 text-sm font-bold text-text">{tip.trait}</p>
            <p className="mb-2 text-xs leading-6 text-text-secondary">{tip.why}</p>
            <p className="rounded-xl bg-primary/5 px-3 py-2 text-xs font-semibold leading-6 text-primary">
              {tip.exercise}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
