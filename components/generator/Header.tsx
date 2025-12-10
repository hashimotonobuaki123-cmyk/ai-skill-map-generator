"use client";

import { Sparkles, Github } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "./LanguageToggle";
import { useLocale } from "./LocaleProvider";

export function Header() {
  const t = useTranslations("generator.header");
  const { locale, toggleLocale } = useLocale();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg-primary)]/80 border-b border-[var(--border-primary)]">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[var(--text-primary)] group-hover:text-gradient transition-colors">
              {t("title")}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-3">
            {/* Language Toggle */}
            <LanguageToggle locale={locale} onToggle={toggleLocale} />
            
            {/* GitHub Link */}
            <a
              href="https://github.com/AyumuKobayashiproducts/ai-skill-map-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">{t("github")}</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
