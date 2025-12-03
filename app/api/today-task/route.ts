import { NextResponse } from "next/server";
import { createOpenAIClient } from "@/lib/openaiClient";
import type { TodayTaskResult } from "@/types/skill";
import { TodayTaskRequestSchema } from "@/types/api";
import { loadSkillMapById } from "@/lib/skillMapLoader";

export async function POST(request: Request) {
  try {
    const { skillMapId, hours } = TodayTaskRequestSchema.parse(
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
    const roadmap30: string = loaded.roadmap30;
    const roadmap90: string = loaded.roadmap90;

    const openai = createOpenAIClient();

    const prompt = [
      "あなたは Web エンジニアの学習を伴走するパーソナルコーチです。",
      "以下のスキルマップと30/90日ロードマップを踏まえて、今日の学習タスクを1つだけ提案してください。",
      "今日使える時間を超えないようにしつつ、「やった感」が出るタスクにしてください。",
      "",
      `今日使える学習時間(目安): ${hours} 時間`,
      "",
      "【カテゴリ別スコア】",
      `frontend=${categories.frontend ?? 0}, backend=${categories.backend ?? 0}, infra=${categories.infra ?? 0}, ai=${categories.ai ?? 0}, tools=${categories.tools ?? 0}`,
      "",
      "【30日ロードマップ】",
      roadmap30,
      "",
      "【90日ロードマップ】",
      roadmap90,
      "",
      "JSON フォーマット:",
      "{",
      '  "title": string,        // 今日やることの短いタイトル',
      '  "description": string,  // 何をやるかの説明（日本語）',
      '  "steps": string,        // 箇条書き風の手順（改行区切り）',
      '  "estimatedHours": number // 想定時間（小数OK）',
      "}",
      "",
      "制約:",
      "- 余計な説明文は出さず、有効な JSON のみを返してください。"
    ].join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "あなたは現実的な学習タスクを1つに絞って提案するコーチです。"
        },
        { role: "user", content: prompt }
      ]
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as TodayTaskResult;

    const result: TodayTaskResult = {
      title: parsed.title ?? "今日のタスク",
      description: parsed.description ?? "",
      steps: parsed.steps ?? "",
      estimatedHours: parsed.estimatedHours ?? hours
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Today task API error", error);
    return NextResponse.json(
      { error: "今日のタスク生成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}


