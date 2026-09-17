export function ProgressBar({
  current,
  total,
  className = "",
}: {
  current: number;
  total: number;
  className?: string;
}) {
  const safeTotal = Math.max(total, 1);
  const pct = Math.min(100, Math.round((current / safeTotal) * 100));
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted">
        <span>
          سؤال {current} از {total}
        </span>
        <span>{pct}٪</span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-neutral"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`پیشرفت آزمون: ${pct} درصد`}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
