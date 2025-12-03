import { NextResponse } from "next/server";
import { createOpenAIClient } from "@/lib/openaiClient";
import type { SkillCategories } from "@/types/skill";
import { StoryRequestSchema } from "@/types/api";

export async function POST(request: Request) {
  try {
    const body = StoryRequestSchema.parse(await request.json());
    const strengths: string | undefined = body.strengths;
    const weaknesses: string | undefined = body.weaknesses;
    const categories: SkillCategories | undefined = body.categories;

    const openai = createOpenAIClient();

    const prompt = [
      "以下の情報から、ユーザーのキャリアやスキル感を表す短いプロフィールストーリーを日本語で作成してください。",
      "・文章量は 3〜5 文程度で、ポジティブで読みやすいトーンにしてください。",
      strengths ? `強み: ${strengths}` : "",
      weaknesses ? `弱み: ${weaknesses}` : "",
      categories
        ? `カテゴリ別スコア: frontend=${categories.frontend ?? 0}, backend=${categories.backend ?? 0}, infra=${categories.infra ?? 0}, ai=${categories.ai ?? 0}, tools=${categories.tools ?? 0}`
        : "",
      "",
      "ストーリーだけを出力してください。"
    ]
      .filter(Boolean)
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "あなたは候補者の魅力を引き出す職務経歴書コーチです。"
        },
        { role: "user", content: prompt }
      ]
    });

    const story = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ story });
  } catch (error) {
    console.error("Story API error", error);
    return NextResponse.json(
      { error: "ストーリー生成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}


