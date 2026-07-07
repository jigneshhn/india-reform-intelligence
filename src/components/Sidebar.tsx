"use client";

import { BarChart3, Brain, Newspaper, RefreshCw, Scale, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export type Tab = "issues" | "corruption" | "sectors" | "benchmarks";

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  dataSource: string;
  issueCount: number;
  criticalCount: number;
  corruptionCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  onRefresh,
  isRefreshing,
  dataSource,
  issueCount,
  criticalCount,
  corruptionCount,
  isOpen,
  onClose,
}: SidebarProps) {
  const { t } = useLanguage();

  const TABS: { id: Tab; labelKey: "tabIssues" | "tabCorruption" | "tabSectors" | "tabBenchmarks"; icon: typeof Newspaper }[] = [
    { id: "issues", labelKey: "tabIssues", icon: Newspaper },
    { id: "corruption", labelKey: "tabCorruption", icon: Scale },
    { id: "sectors", labelKey: "tabSectors", icon: BarChart3 },
    { id: "benchmarks", labelKey: "tabBenchmarks", icon: Brain },
  ];

  const handleTab = (tab: Tab) => {
    onTabChange(tab);
    onClose();
  };

  const content = (
    <>
      <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-[var(--accent)] flex items-center justify-center">
            <span className="text-white font-semibold text-sm">IR</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)] leading-tight">
              {t("appName")}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] tracking-wide uppercase">
              {t("appTagline")}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-md hover:bg-[var(--bg-elevated)] text-[var(--text-muted)]"
          aria-label={t("close")}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-[var(--accent-soft)] text-[var(--accent)] border-l-2 border-[var(--accent)] pl-[10px]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              {t(tab.labelKey)}
              {tab.id === "corruption" && corruptionCount > 0 && (
                <span className="ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--error)]/15 text-[var(--error)]">
                  {corruptionCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--border-subtle)] space-y-3">
        <LanguageSwitcher />

        <div className="px-2 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">{t("issuesTracked")}</span>
            <span className="font-mono text-[var(--text-primary)]">{issueCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">{t("critical")}</span>
            <span className="font-mono text-[var(--error)]">{criticalCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                dataSource === "live" || dataSource === "cache"
                  ? "bg-[var(--success)]"
                  : dataSource === "loading"
                    ? "bg-[var(--warning)] animate-pulse"
                    : "bg-[var(--warning)]"
              }`}
            />
            {dataSource === "live"
              ? t("liveFeed")
              : dataSource === "loading"
                ? t("loading")
                : dataSource === "cache"
                  ? t("cached")
                  : t("cached")}
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-xs font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors disabled:opacity-50 min-h-[40px]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          {t("refreshData")}
        </button>
      </div>
    </>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 sm:w-56 shrink-0
          border-r border-[var(--border-subtle)] bg-[var(--bg-secondary)]
          flex flex-col h-full
          transform transition-transform duration-200 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {content}
      </aside>
    </>
  );
}