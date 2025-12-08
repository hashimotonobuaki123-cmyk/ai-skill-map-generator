"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";

/**
 * Supabase からの OAuth リダイレクトを受け取るコールバック用ページ。
 *
 * 以前は数秒メッセージを表示してからトップへ戻していたが、
 * 「変なロード画面」に見えるため、できるだけすぐ元の画面に戻す。
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const supabase = getSupabaseBrowserClient();

        // すでにセッションがあるか確認
        const { data } = await supabase.auth.getUser();

        // 元いた場所に戻すためのパラメータ（なければルートへ）
        const url = new URL(window.location.href);
        const redirectTo = url.searchParams.get("redirect_to") ?? "/";

        if (data.user) {
          router.replace(redirectTo);
          return;
        }

        // 古いフローで code パラメータ付きで来た場合のフォールバック
        const code = url.searchParams.get("code");
        if (!code) {
          setStatus("error");
          return;
        }

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("Auth callback error", error);
          setStatus("error");
          return;
        }

        router.replace(redirectTo);
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    };

    void handleAuth();
  }, [router]);

  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span className="h-4 w-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <span>
          {status === "loading"
            ? "サインイン処理中です..."
            : "ログインに失敗しました。もう一度お試しください。"}
        </span>
      </div>
    </div>
  );
}


