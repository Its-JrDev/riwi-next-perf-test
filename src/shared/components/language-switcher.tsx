"use client";

import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Locale = "es" | "en";

const DEFAULT_LOCALE: Locale = "es";
const locales = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
] as const satisfies ReadonlyArray<{ code: Locale; label: string }>;

function getSavedLocale(): Locale {
  if (typeof document === "undefined") {
    return DEFAULT_LOCALE;
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("NEXT_LOCALE="));

  return cookieValue?.split("=")[1] === "en" ? "en" : DEFAULT_LOCALE;
}

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const [value, setValue] = useState<Locale>(DEFAULT_LOCALE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setValue(getSavedLocale());
    setIsHydrated(true);
  }, []);

  const handleLocaleChange = (nextLocale: Locale) => {
    setValue(nextLocale);
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  };

  const accessibilityLabel = isHydrated
    ? t("language", { locale: value })
    : "Language selector";

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="language-selector">
        {accessibilityLabel}
      </label>

      <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5 text-sm shadow-sm">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <select
          id="language-selector"
          value={value}
          onChange={(event) => handleLocaleChange(event.target.value as Locale)}
          className="appearance-none bg-transparent pr-6 text-sm font-medium text-foreground outline-none"
          aria-label={accessibilityLabel}
        >
          {locales.map((locale) => (
            <option key={locale.code} value={locale.code}>
              {locale.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none text-xs text-muted-foreground">
          ▾
        </span>
      </div>
    </div>
  );
}
