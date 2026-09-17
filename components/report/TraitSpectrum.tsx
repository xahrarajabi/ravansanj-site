import type { TraitPayload } from "@/lib/report-builder";

export function TraitSpectrum({ traits }: { traits: TraitPayload[] }) {
  return (
    <div className="mb-8 flex flex-col gap-5">
      <h2 className="text-sm font-extrabold text-text">نقشه ابعاد</h2>
      {traits.map((t) => (
        <div key={t.key}>
          <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
            <span className="font-bold text-text">{t.label}</span>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-neutral px-2 py-0.5 text-[10px] font-bold text-text-secondary">
                {t.bandLabel}
              </span>
              <span className="font-semibold text-primary">{t.score}</span>
            </div>
          </div>
          <div className="mb-2 h-2.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(100, Math.max(0, t.score))}%` }}
            />
          </div>
          {t.title ? (
            <p className="mb-1 text-xs font-bold text-text">{t.title}</p>
          ) : null}
          <p className="text-xs leading-6 text-text-secondary">{t.interpretation}</p>
        </div>
      ))}
    </div>
  );
}
