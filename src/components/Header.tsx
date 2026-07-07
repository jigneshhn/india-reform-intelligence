"use client";

import { Menu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  selectedSector: string | null;
  onClearFilter: () => void;
  onMenuOpen: () => void;
}

export default function Header({
  selectedSector,
  onClearFilter,
  onMenuOpen,
}: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuOpen}
            className="lg:hidden p-2 -ml-1 rounded-md hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] shrink-0"
            aria-label={t("menu")}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-medium text-[var(--text-primary)] tracking-tight truncate">
              {t("pageTitle")}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5 line-clamp-1">
              {t("pageSubtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:block">
            <LanguageSwitcher compact />
          </div>
          {selectedSector && (
            <button
              onClick={onClearFilter}
              className="text-xs px-2.5 py-1.5 rounded-md border border-[var(--border)] text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors whitespace-nowrap"
            >
              {selectedSector.replace("-", " ")} ×
            </button>
          )}
        </div>
      </div>
    </header>
  );
}