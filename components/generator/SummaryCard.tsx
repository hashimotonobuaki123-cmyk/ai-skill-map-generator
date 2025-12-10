"use client";

import { useTranslations } from "next-intl";
import { TrendingUp, AlertTriangle, Target, LucideIcon } from "lucide-react";
import { SummaryItem } from "@/types/skillGenerator";

interface SummaryCardProps {
  type: "strengths" | "weaknesses" | "nextFocus";
  items: SummaryItem[];
}

const CONFIG: Record<
  SummaryCardProps["type"],
  {
    titleKey: string;
    icon: LucideIcon;
    className: string;
  }
> = {
  strengths: {
    titleKey: "strengths",
    icon: TrendingUp,
    className: "summary-card-strength",
  },
  weaknesses: {
    titleKey: "weaknesses",
    icon: AlertTriangle,
    className: "summary-card-weakness",
  },
  nextFocus: {
    titleKey: "nextFocus",
    icon: Target,
    className: "summary-card-focus",
  },
};

export function SummaryCard({ type, items }: SummaryCardProps) {
  const t = useTranslations("generator.summary");
  const { titleKey, icon: Icon, className } = CONFIG[type];

  return (
    <div className={`summary-card ${className} animate-fade-in-up`}>
      <div className="summary-card-icon">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        {t(titleKey)}
      </h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3">
            <span className="text-[var(--text-muted)] shrink-0">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {item.title}
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
