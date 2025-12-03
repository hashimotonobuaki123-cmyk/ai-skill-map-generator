import { NextResponse } from "next/server";
import { createOpenAIClient } from "@/lib/openaiClient";
import type { OneOnOneFeedback } from "@/types/skill";
import { OneOnOneFeedbackRequestSchema } from "@/types/api";

export async function POST(request: Request) {
  try {
    const { question, answer, strengths, weaknesses } =
      OneOnOneFeedbackRequestSchema.parse(await request.json());

    const openai = createOpenAIClient();

    const prompt = [
      "あなたはエンジニアリングマネージャーとして評価面談のコーチングを行います。",
      "以下の質問と候補者の回答について、",
      "1) 回答の良い点",
      "2) もっと具体的にした方が良い点",
      "3) より伝わりやすい模範回答例",
      "を日本語でフィードバックしてください。",
      strengths ? `強み: ${strengths}` : "",
      weaknesses ? `弱み: ${weaknesses}` : "",
      "",
      `質問: ${question}`,
      `回答: ${answer}`,
      "",
      "JSON フォーマット:",
      "{",
      '  "feedback": string,',
      '  "improvedAnswer": string',
      "}",
      "",
      "制約:",
      "- 余計な説明文は出さず、有効な JSON のみを返してください。"
    ]
      .filter(Boolean)
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "あなたは候補者の魅力を引き出すことが得意なエンジニアリングマネージャーです。"
        },
        { role: "user", content: prompt }
      ]
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as OneOnOneFeedback;

    const result: OneOnOneFeedback = {
      feedback: parsed.feedback ?? "",
      improvedAnswer: parsed.improvedAnswer ?? ""
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("OneOnOne feedback API error", error);
    return NextResponse.json(
      { error: "1on1 フィードバック生成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}


