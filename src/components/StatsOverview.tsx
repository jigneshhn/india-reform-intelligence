"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { DashboardStats } from "@/lib/types";

interface StatsOverviewProps {
  stats: DashboardStats;
  corruptionCount?: number;
  showCorruption?: boolean;
}

export default function StatsOverview({
  stats,
  corruptionCount = 0,
  showCorruption = false,
}: StatsOverviewProps) {
  const { t } = useLanguage();

  const items = showCorruption
    ? [
        { label: t("corruptionToday"), value: corruptionCount, accent: "text-[var(--error)]" },
        { label: t("issuesTracked"), value: stats.totalIssues },
        { label: t("critical"), value: stats.criticalIssues, accent: "text-[var(--error)]" },
        { label: t("avgGap"), value: `${stats.avgGapPercent}%`, accent: "text-[var(--warning)]" },
      ]
    : [
        { label: t("issuesTracked"), value: stats.totalIssues },
        { label: t("critical"), value: stats.criticalIssues, accent: "text-[var(--error)]" },
        { label: t("sectorsAffected"), value: stats.sectorsAffected },
        { label: t("avgGap"), value: `${stats.avgGapPercent}%`, accent: "text-[var(--warning)]" },
      ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border-subtle)] rounded-lg overflow-hidden border border-[var(--border-subtle)]">
      {items.map((item) => (
        <div key={item.label} className="bg-[var(--bg-secondary)] px-3 sm:px-4 py-3">
          <p className={`text-lg sm:text-xl font-mono font-medium ${item.accent || "text-[var(--text-primary)]"}`}>
            {item.value}
          </p>
          <p className="text-[10px] sm:text-xs text-[var(--text-muted)] mt-1 uppercase tracking-wide leading-tight">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}