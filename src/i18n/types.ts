export type Locale = "en" | "hi";

export const DEFAULT_LOCALE: Locale = "en";

export const SUPPORTED_LOCALES: readonly Locale[] = ["en", "hi"] as const;

/** Reserved for future rollout — add locale files under src/i18n/locales/ */
export const PLANNED_LOCALES = [
  "ta", "te", "bn", "mr", "gu", "kn", "ml", "pa", "or", "as", "ur",
] as const;

export type TranslationKey = keyof typeof import("./locales/en").en;