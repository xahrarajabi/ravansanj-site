import type { ComparisonItem } from "@/lib/report-builder";

export function SelfOtherComparison({ comparison }: { comparison: ComparisonItem[] }) {
  if (!comparison.length) {
    return (
      <div className="mb-8 rounded-2xl bg-neutral p-4 text-sm text-text-secondary">
        هنوز بازخورد ۳۶۰ برای مقایسه ثبت نشده است. از بخش دعوت، اطرافیان را دعوت کنید.
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="mb-3 text-sm font-extrabold text-text">مقایسه خود و دیگران</h2>
      <div className="flex flex-col gap-4">
        {comparison.map((c) => (
          <div key={c.traitKey} className="rounded-2xl border border-gray-100 p-4">
            <p className="mb-3 text-sm font-bold text-text">{c.trait}</p>
            <div className="mb-2">
              <div className="mb-1 flex justify-between text-xs">
                <span>خودتان</span>
                <span className="text-primary">{c.self}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${c.self}%` }}
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="mb-1 flex justify-between text-xs">
                <span>دیگران</span>
                <span className="text-secondary">{c.other}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-secondary/70"
                  style={{ width: `${c.other}%` }}
                />
              </div>
            </div>
            <p className="text-xs leading-6 text-text-secondary">{c.insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
