import { NextResponse } from "next/server";
import { createOpenAIClient } from "@/lib/openaiClient";
import { CoachRequestSchema } from "@/types/api";

export async function POST(request: Request) {
  try {
    const { messages, context } = CoachRequestSchema.parse(
      await request.json()
    );

    const openai = createOpenAIClient();

    const systemContent = [
      "あなたは Web エンジニア向けの優しいキャリアコーチです。",
      "ユーザーの強み・弱み・ロードマップを踏まえて、現実的で前向きなアドバイスを日本語で返してください。",
      context?.strengths ? `強み: ${context.strengths}` : "",
      context?.weaknesses ? `弱み: ${context.weaknesses}` : "",
      context?.roadmap30 ? `30日ロードマップ: ${context.roadmap30}` : "",
      context?.roadmap90 ? `90日ロードマップ: ${context.roadmap90}` : ""
    ]
      .filter(Boolean)
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemContent },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content
        }))
      ]
    });

    const reply = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Coach API error", error);
    return NextResponse.json(
      { error: "AI コーチとの対話中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}


