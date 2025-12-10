"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("generator.footer");

  return (
    <footer className="border-t border-[var(--border-primary)] py-12">
      <div className="container-default">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-[var(--text-secondary)]">
              {t("title")}
            </span>
          </div>

          {/* Tech Stack */}
          <div className="flex items-center gap-4 text-sm text-[var(--text-tertiary)]">
            <span>{t("builtWith")}</span>
            <div className="flex items-center gap-2">
              <span className="badge badge-default">Next.js 14</span>
              <span className="badge badge-default">TypeScript</span>
              <span className="badge badge-default">OpenAI</span>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-sm text-[var(--text-muted)]">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
