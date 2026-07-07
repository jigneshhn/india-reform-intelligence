import { en } from "./locales/en";
import { hi } from "./locales/hi";
import { DEFAULT_LOCALE, Locale, TranslationKey } from "./types";

const dictionaries = { en, hi } as const;

export function getTranslations(locale: Locale) {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

export function t(locale: Locale, key: TranslationKey): string {
  return getTranslations(locale)[key];
}

export type { Locale, TranslationKey };
export { DEFAULT_LOCALE, SUPPORTED_LOCALES, PLANNED_LOCALES } from "./types";