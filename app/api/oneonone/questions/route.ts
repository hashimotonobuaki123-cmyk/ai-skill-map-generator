import { NextResponse } from "next/server";
import { createOpenAIClient } from "@/lib/openaiClient";
import type { OneOnOneQuestions } from "@/types/skill";
import { OneOnOneQuestionsRequestSchema } from "@/types/api";
import { loadSkillMapById } from "@/lib/skillMapLoader";

export async function POST(request: Request) {
  try {
    const { skillMapId } = OneOnOneQuestionsRequestSchema.parse(
      await request.json()
    );

    const loaded = await loadSkillMapById(skillMapId);

    if (!loaded) {
      return NextResponse.json(
        { error: "指定されたスキルマップが見つかりませんでした。" },
        { status: 404 }
      );
    }

    const categories = loaded.categories;
    const strengths: string = loaded.strengths;
    const weaknesses: string = loaded.weaknesses;

    const openai = createOpenAIClient();

    const prompt = [
      "あなたはエンジニアリングマネージャーです。",
      "候補者との評価面談（1on1）を想定し、以下の情報をもとにして3〜5問の質問を作成してください。",
      "各質問は日本語で、具体的なエピソードや成果を引き出すような内容にしてください。",
      "",
      "【候補者のスキルマップ】",
      `- カテゴリ別スコア: frontend=${categories.frontend ?? 0}, backend=${
        categories.backend ?? 0
      }, infra=${categories.infra ?? 0}, ai=${categories.ai ?? 0}, tools=${
        categories.tools ?? 0
      }`,
      `- 強み: ${strengths}`,
      `- 弱み: ${weaknesses}`,
      "",
      "JSON フォーマット:",
      "{",
      '  "questions": string[]',
      "}",
      "",
      "制約:",
      "- 余計な説明文は出さず、有効な JSON のみを返してください。",
      "- 各質問は1文程度で簡潔にしてください。"
    ].join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "あなたは評価面談が得意なエンジニアリングマネージャーです。"
        },
        { role: "user", content: prompt }
      ]
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as OneOnOneQuestions;

    const result: OneOnOneQuestions = {
      questions: parsed.questions ?? []
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("OneOnOne questions API error", error);
    return NextResponse.json(
      { error: "1on1 質問生成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}


