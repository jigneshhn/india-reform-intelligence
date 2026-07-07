"use client";

import { formatDistanceToNow } from "date-fns";
import { hi as hiLocale } from "date-fns/locale";
import { ExternalLink, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { NewsItem, SectorId } from "@/lib/types";

const SEVERITY_STYLES = {
  critical: "border-l-[var(--error)]",
  high: "border-l-[var(--accent)]",
  medium: "border-l-[var(--warning)]",
  low: "border-l-[var(--border)]",
};

interface NewsFeedProps {
  news: NewsItem[];
  selectedSector: SectorId | null;
  onAnalyze: (item: NewsItem) => void;
  analyzingId: string | null;
}

export default function NewsFeed({
  news,
  selectedSector,
  onAnalyze,
  analyzingId,
}: NewsFeedProps) {
  const { locale, t } = useLanguage();
  const filtered = selectedSector
    ? news.filter((n) => n.sector === selectedSector)
    : news;

  return (
    <div className="space-y-2">
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-muted)] text-sm">
          {t("noIssues")}
        </div>
      ) : (
        filtered.map((item) => (
          <article
            key={item.id}
            className={`px-3 sm:px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] border-l-[3px] ${SEVERITY_STYLES[item.severity]} rounded-r-md hover:border-[var(--border)] transition-colors`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5 font-mono text-[10px] uppercase tracking-wide">
                  <span className="text-[var(--accent)]">
                    {item.sector.replace("-", " ")}
                  </span>
                  <span className="text-[var(--text-muted)]">·</span>
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
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
                <p className="text-[10px] text-[var(--text-muted)] mt-1.5 font-mono">
                  {item.source}
                </p>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0">
                <button
                  onClick={() => onAnalyze(item)}
                  disabled={analyzingId === item.id}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium transition-colors disabled:opacity-50 min-h-[36px]"
                >
                  <Sparkles
                    className={`w-3 h-3 ${analyzingId === item.id ? "animate-pulse" : ""}`}
                  />
                  {analyzingId === item.id ? t("analyzing") : t("analyze")}
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
        ))
      )}
    </div>
  );
}