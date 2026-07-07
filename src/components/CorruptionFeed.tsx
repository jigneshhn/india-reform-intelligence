"use client";

import { formatDistanceToNow } from "date-fns";
import { hi as hiLocale } from "date-fns/locale";
import { ExternalLink, List, Newspaper } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CorruptionItem } from "@/lib/types";

interface CorruptionFeedProps {
  items: CorruptionItem[];
  grouped: Record<string, CorruptionItem[]>;
  newspapers: string[];
  selectedPaper: string | null;
  onSelectPaper: (paper: string | null) => void;
  onAnalyze: (item: CorruptionItem) => void;
  analyzingId: string | null;
  viewMode: "list" | "grouped";
  onViewModeChange: (mode: "list" | "grouped") => void;
  fetchedAt?: string;
}

const SEVERITY_BORDER = {
  critical: "border-l-[var(--error)]",
  high: "border-l-[var(--accent)]",
  medium: "border-l-[var(--warning)]",
  low: "border-l-[var(--border)]",
};

function CorruptionCard({
  item,
  onAnalyze,
  analyzingId,
}: {
  item: CorruptionItem;
  onAnalyze: (item: CorruptionItem) => void;
  analyzingId: string | null;
}) {
  const { locale, t } = useLanguage();

  return (
    <article
      className={`px-3 sm:px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] border-l-[3px] ${SEVERITY_BORDER[item.severity]} rounded-r-md hover:border-[var(--border)] transition-colors`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5 font-mono text-[10px] uppercase tracking-wide">
            <span className="text-[var(--accent)]">{item.newspaper}</span>
            <span className="text-[var(--text-muted)] hidden sm:inline">·</span>
            <span
              className={
                item.severity === "critical"
                  ? "text-[var(--error)]"
                  : item.severity === "high"
                    ? "text-[var(--accent)]"
                    : "text-[var(--text-muted)]"
              }
            >
              {item.severity}
            </span>
            <span className="text-[var(--text-muted)]">·</span>
            <span className="text-[var(--text-muted)] normal-case tracking-normal font-sans text-[11px]">
              {formatDistanceToNow(new Date(item.pubDate), {
                addSuffix: true,
                locale: locale === "hi" ? hiLocale : undefined,
              })}
            </span>
          </div>

          <h3 className="font-medium text-[var(--text-primary)] text-sm leading-snug mb-1">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        <div className="flex sm:flex-col gap-2 shrink-0">
          <button
            onClick={() => onAnalyze(item)}
            disabled={analyzingId === item.id}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium transition-colors disabled:opacity-50 min-h-[36px]"
          >
            {analyzingId === item.id ? t("analyzing") : t("stepSolution")}
          </button>
          {item.link !== "#" && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs transition-colors min-h-[36px]"
            >
              <ExternalLink className="w-3 h-3" />
              {t("source")}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function CorruptionFeed({
  items,
  grouped,
  newspapers,
  selectedPaper,
  onSelectPaper,
  onAnalyze,
  analyzingId,
  viewMode,
  onViewModeChange,
  fetchedAt,
}: CorruptionFeedProps) {
  const { t } = useLanguage();

  const filtered = selectedPaper
    ? items.filter((i) => i.newspaper === selectedPaper)
    : items;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-medium text-[var(--text-primary)]">
            {t("corruptionDailyTitle")}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 max-w-xl">
            {t("corruptionDailyDesc")}
          </p>
          {fetchedAt && (
            <p className="text-[10px] text-[var(--text-muted)] font-mono mt-1">
              {t("lastUpdated")}: {new Date(fetchedAt).toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-2 rounded-md border transition-colors ${
              viewMode === "list"
                ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--border)] text-[var(--text-muted)]"
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("grouped")}
            className={`p-2 rounded-md border transition-colors ${
              viewMode === "grouped"
                ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--border)] text-[var(--text-muted)]"
            }`}
            aria-label="Grouped view"
          >
            <Newspaper className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
        <button
          onClick={() => onSelectPaper(null)}
          className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
            !selectedPaper
              ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]"
              : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          {t("allNewspapers")} ({items.length})
        </button>
        {newspapers.map((paper) => (
          <button
            key={paper}
            onClick={() => onSelectPaper(paper)}
            className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors whitespace-nowrap ${
              selectedPaper === paper
                ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            {paper} ({grouped[paper]?.length || 0})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-muted)] text-sm">
          {t("noCorruption")}
        </div>
      ) : viewMode === "grouped" && !selectedPaper ? (
        <div className="space-y-6">
          {newspapers.map((paper) => {
            const paperItems = grouped[paper];
            if (!paperItems?.length) return null;
            return (
              <section key={paper}>
                <h3 className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium mb-2 px-1">
                  {paper} — {paperItems.length} {t("casesFound").toLowerCase()}
                </h3>
                <div className="space-y-2">
                  {paperItems.map((item) => (
                    <CorruptionCard
                      key={item.id}
                      item={item}
                      onAnalyze={onAnalyze}
                      analyzingId={analyzingId}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <CorruptionCard
              key={item.id}
              item={item}
              onAnalyze={onAnalyze}
              analyzingId={analyzingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}