import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { UsageLogRequestSchema } from "@/types/api";

export async function POST(request: Request) {
  try {
    const body = UsageLogRequestSchema.parse(await request.json());
    const supabase = createSupabaseClient();

    const { error } = await supabase.from("usage_logs").insert({
      event: body.event,
      user_id: body.userId ?? null,
      meta: body.meta ?? null
    });

    if (error) {
      console.error("Usage log insert error", error);
      return NextResponse.json(
        { error: "usage log insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Usage log API error", error);
    return NextResponse.json({ error: "usage log error" }, { status: 500 });
  }
}


