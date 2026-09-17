import type { ReactNode } from "react";
import { REPORT_TYPE_LABELS } from "@/lib/report-builder";

export function ReportHero({
  title,
  type,
  summary,
  dateLabel,
  extra,
}: {
  title: string;
  type: string;
  summary: string;
  dateLabel?: string;
  extra?: ReactNode;
}) {
  const typeFa = REPORT_TYPE_LABELS[type] || type;
  return (
    <div className="mb-8">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          گزارش {typeFa}
        </span>
        {dateLabel ? (
          <span className="text-xs text-gray-400">{dateLabel}</span>
        ) : null}
      </div>
      <h1 className="mb-2 text-xl font-extrabold text-text">{title}</h1>
      <p className="text-sm leading-7 text-text-secondary">{summary}</p>
      {extra}
    </div>
  );
}
