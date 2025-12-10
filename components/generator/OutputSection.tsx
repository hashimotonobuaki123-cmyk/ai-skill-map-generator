"use client";

import { useTranslations } from "next-intl";
import { SkillMapOutput } from "@/types/skillGenerator";
import { RadarChart } from "./RadarChart";
import { SummaryGrid } from "./SummaryGrid";

interface OutputSectionProps {
  result: SkillMapOutput;
}

export function OutputSection({ result }: OutputSectionProps) {
  const t = useTranslations("generator.output");

  return (
    <section className="section" id="output">
      <div className="container-default">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            {t("title")}
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Radar Chart */}
        <div className="max-w-2xl mx-auto mb-16">
          <RadarChart labels={result.radar.labels} data={result.radar.data} />
        </div>

        {/* Summary Cards */}
        <SummaryGrid
          strengths={result.summary.strengths}
          weaknesses={result.summary.weaknesses}
          nextFocus={result.summary.nextFocus}
        />
      </div>
    </section>
  );
}
