import { NextResponse } from "next/server";
import { createOpenAIClient } from "@/lib/openaiClient";
import type { PortfolioGeneratorResult } from "@/types/skill";
import { PortfolioRequestSchema } from "@/types/api";

export async function POST(request: Request) {
  try {
    const { items } = PortfolioRequestSchema.parse(await request.json());

    const openai = createOpenAIClient();

    const lines: string[] = [
      "あなたはソフトウェアエンジニアのポートフォリオ作成を支援するコーチです。",
      "以下のプロジェクト情報から、ポートフォリオに載せるべき案件TOP3を選び、各案件について要約・アピールポイント・振り返りコメントを作成してください。",
      "",
      "【プロジェクト候補】"
    ];

    items.forEach((item, idx) => {
      lines.push(
        `#${idx + 1}`,
        `タイトル: ${item.title ?? "(未入力)"}`,
        item.url ? `URL: ${item.url}` : "",
        item.description ? `説明: ${item.description}` : "",
        ""
      );
    });

    lines.push(
      "JSON フォーマット:",
      "{",
      '  "items": [',
      "    {",
      '      "title": string,',
      '      "url": string,',
      '      "summary": string,',
      '      "sellingPoints": string,',
      '      "reflection": string',
      "    },",
      "    ... 最大3件",
      "  ],",
      '  "markdown": string // Notion/Markdown にそのまま貼れる一覧',
      "}",
      "",
      "制約:",
      "- 余計な説明文は出さず、有効な JSON のみを返してください。"
    );

    const prompt = lines.filter(Boolean).join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "あなたは候補者のポートフォリオを分かりやすく整理するメンターです。"
        },
        { role: "user", content: prompt }
      ]
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as PortfolioGeneratorResult;

    const result: PortfolioGeneratorResult = {
      items: parsed.items ?? [],
      markdown: parsed.markdown ?? ""
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Portfolio API error", error);
    return NextResponse.json(
      { error: "ポートフォリオ生成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}


