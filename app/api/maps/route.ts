import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabaseClient";

// 簡易的に userId クエリパラメータでフィルタリング（デモ用途）
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const supabase = createSupabaseClient();

    let query = supabase
      .from("skill_maps")
      .select("id, created_at, categories, user_id")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase fetch error", error);
      return NextResponse.json(
        { error: "一覧の取得に失敗しました。" },
        { status: 500 }
      );
    }

    const result =
      data?.map((row) => ({
        id: row.id as string,
        createdAt: row.created_at as string,
        categories: (row.categories ?? {}) as Record<string, number>,
        userId: row.user_id as string | null
      })) ?? [];

    return NextResponse.json(result);
  } catch (error) {
    console.error("Maps API error", error);
    return NextResponse.json(
      { error: "一覧取得中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}


