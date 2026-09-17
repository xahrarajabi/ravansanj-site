import type { TraitPayload } from "@/lib/report-builder";

export function StrengthsWeaknesses({
  strengths,
  weaknesses,
}: {
  strengths: TraitPayload[];
  weaknesses: TraitPayload[];
}) {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl bg-emerald-50 p-4">
        <h2 className="mb-3 text-sm font-extrabold text-emerald-900">نقاط قوت</h2>
        <ul className="flex flex-col gap-3">
          {strengths.map((t) => (
            <li key={`s-${t.key}`}>
              <p className="text-sm font-bold text-emerald-900">
                {t.label} · {t.score}
              </p>
              <ul className="mt-1 list-disc pe-4 text-xs leading-6 text-emerald-800">
                {(t.strengths || []).slice(0, 3).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl bg-amber-50 p-4">
        <h2 className="mb-3 text-sm font-extrabold text-amber-900">نیازمند توجه</h2>
        <ul className="flex flex-col gap-3">
          {weaknesses.map((t) => (
            <li key={`w-${t.key}`}>
              <p className="text-sm font-bold text-amber-900">
                {t.label} · {t.score}
              </p>
              <ul className="mt-1 list-disc pe-4 text-xs leading-6 text-amber-800">
                {(t.growthTips || []).slice(0, 2).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
