"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { Locale } from "@/i18n";

const OPTIONS: { value: Locale; labelKey: "langEnglish" | "langHindi" }[] = [
  { value: "en", labelKey: "langEnglish" },
  { value: "hi", labelKey: "langHindi" },
];

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      className={`flex items-center gap-1 p-0.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)] ${
        compact ? "" : ""
      }`}
      role="group"
      aria-label={t("language")}
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLocale(opt.value)}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            locale === opt.value
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          {t(opt.labelKey)}
        </button>
      ))}
    </div>
  );
}