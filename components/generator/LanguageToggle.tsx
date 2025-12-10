"use client";

import { Globe } from "lucide-react";

interface LanguageToggleProps {
  locale: string;
  onToggle: () => void;
}

export function LanguageToggle({ locale, onToggle }: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-[var(--border-hover)] transition-colors"
      aria-label={locale === "ja" ? "Switch to English" : "日本語に切り替え"}
    >
      <Globe className="w-4 h-4 text-[var(--text-tertiary)]" />
      <span className="text-sm font-medium text-[var(--text-secondary)]">
        {locale === "ja" ? "EN" : "JA"}
      </span>
    </button>
  );
}

