"use client";

import { useTranslations } from "next-intl";
import { SkillInput } from "@/types/skillGenerator";
import { Trash2 } from "lucide-react";

interface SkillRowProps {
  skill: SkillInput;
  onChange: (skill: SkillInput) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function SkillRow({ skill, onChange, onRemove, canRemove }: SkillRowProps) {
  const t = useTranslations("generator");

  const levelLabels: Record<number, string> = {
    1: t("levels.beginner"),
    2: t("levels.elementary"),
    3: t("levels.intermediate"),
    4: t("levels.advanced"),
    5: t("levels.expert"),
  };

  const getYearLabel = (years: number): string => {
    if (years === 0) return t("years.lessThan1");
    if (years === 10) return t("years.tenPlus");
    if (years === 1) return t("years.year", { n: years });
    return t("years.years", { n: years });
  };

  return (
    <div className="skill-row group animate-fade-in-up">
      {/* Skill Name */}
      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={skill.name}
          onChange={(e) => onChange({ ...skill, name: e.target.value })}
          placeholder={t("input.placeholder")}
          className="input"
        />
      </div>

      {/* Years of Experience */}
      <div className="w-24 shrink-0">
        <select
          value={skill.yearsOfExperience}
          onChange={(e) => onChange({ ...skill, yearsOfExperience: Number(e.target.value) })}
          className="select"
        >
          {[...Array(11)].map((_, i) => (
            <option key={i} value={i}>
              {getYearLabel(i)}
            </option>
          ))}
        </select>
      </div>

      {/* Level */}
      <div className="w-32 shrink-0">
        <select
          value={skill.level}
          onChange={(e) => onChange({ ...skill, level: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
          className="select"
        >
          {([1, 2, 3, 4, 5] as const).map((level) => (
            <option key={level} value={level}>
              {levelLabels[level]}
            </option>
          ))}
        </select>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        className="btn btn-ghost btn-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
        aria-label={t("input.removeSkill")}
      >
        <Trash2 className="w-4 h-4 text-[var(--text-tertiary)]" />
      </button>
    </div>
  );
}
