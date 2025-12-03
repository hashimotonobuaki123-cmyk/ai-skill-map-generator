import { createSupabaseClient } from "@/lib/supabaseClient";
import type { SkillCategories } from "@/types/skill";

export interface LoadedSkillMap {
  id: string;
  categories: SkillCategories;
  strengths: string;
  weaknesses: string;
  roadmap30: string;
  roadmap90: string;
  chartData: unknown;
  createdAt: string;
}

export async function loadSkillMapById(
  skillMapId: string
): Promise<LoadedSkillMap | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("skill_maps")
    .select("*")
    .eq("id", skillMapId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id as string,
    categories: (data.categories ?? {}) as SkillCategories,
    strengths: (data.strengths as string) ?? "",
    weaknesses: (data.weaknesses as string) ?? "",
    roadmap30: (data.roadmap_30 as string) ?? "",
    roadmap90: (data.roadmap_90 as string) ?? "",
    chartData: data.chart_data ?? null,
    createdAt: data.created_at as string
  };
}


