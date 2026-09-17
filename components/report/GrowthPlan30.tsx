import type { PlanDay } from "@/lib/report-builder";

export function GrowthPlan30({
  plan30,
  compact,
}: {
  plan30: PlanDay[];
  compact?: boolean;
}) {
  const items = compact ? plan30.slice(0, 7) : plan30;
  return (
    <div className="mb-8">
      <h2 className="mb-1 text-sm font-extrabold text-text">برنامه ۳۰ روزه</h2>
      {compact ? (
        <p className="mb-3 text-xs text-text-secondary">
          ۷ روز اول نمایش داده شده؛ نسخه کامل در مسیر رشد در دسترس است.
        </p>
      ) : (
        <p className="mb-3 text-xs text-text-secondary">
          هر روز یک تمرین کوتاه بر اساس ضعیف‌ترین ابعاد شما.
        </p>
      )}
      <div className="flex flex-col gap-2">
        {items.map((d) => (
          <div
            key={d.day}
            className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-black text-primary">
              {d.day.toLocaleString("fa-IR")}
            </div>
            <div>
              <p className="text-sm font-bold text-text">{d.title}</p>
              <p className="text-xs leading-6 text-text-secondary">{d.task}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
