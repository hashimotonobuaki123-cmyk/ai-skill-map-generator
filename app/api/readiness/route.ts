import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabaseClient";
import type { SkillCategories } from "@/types/skill";
import { ReadinessRequestSchema } from "@/types/api";
import { calculateReadinessScore } from "@/lib/readiness";

export async function POST(request: Request) {
  try {
    const body = ReadinessRequestSchema.parse(await request.json());
    const {
      skillMapId,
      jobMatchScore,
      riskObsolescence,
      riskBusFactor,
      riskAutomation,
      prepScore: prepScoreInput
    } = body;

    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("skill_maps")
      .select("categories")
      .eq("id", skillMapId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "指定されたスキルマップが見つかりませんでした。" },
        { status: 404 }
      );
    }

    const categories = (data.categories ?? {}) as SkillCategories;

    const result = calculateReadinessScore({
      categories,
      jobMatchScore,
      riskObsolescence,
      riskBusFactor,
      riskAutomation,
      prepScore: prepScoreInput
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Readiness API error", error);
    return NextResponse.json(
      { error: "転職準備スコア算出中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}


