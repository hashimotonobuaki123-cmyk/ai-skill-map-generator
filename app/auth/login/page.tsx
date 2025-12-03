"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";

export default function AuthLoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) {
          throw error;
        }
      }

      router.push("/");
    } catch (e) {
      console.error(e);
      setError(
        mode === "login"
          ? "ログインに失敗しました。メールアドレスとパスワードを確認してください。"
          : "新規登録に失敗しました。入力内容を確認し、時間をおいて再度お試しください。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <div>
        <h2 className="text-xl font-semibold">
          {mode === "login" ? "ログイン" : "新規登録"}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          メールアドレスとパスワードを使ってサインインできます。
        </p>
      </div>

      <div className="flex gap-2 text-xs">
        <button
          type="button"
          className={`px-3 py-1 rounded-full border ${
            mode === "login"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-border"
          }`}
          onClick={() => setMode("login")}
        >
          ログイン
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded-full border ${
            mode === "signup"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-border"
          }`}
          onClick={() => setMode("signup")}
        >
          新規登録
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div className="space-y-1">
          <label className="block text-xs font-medium">メールアドレス</label>
          <input
            type="email"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium">パスワード</label>
          <input
            type="password"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8文字以上を推奨"
          />
        </div>

        {error && <ErrorAlert message={error} />}

        <Button type="submit" disabled={loading} className="w-full mt-1">
          {loading
            ? mode === "login"
              ? "ログイン中..."
              : "登録中..."
            : mode === "login"
            ? "ログイン"
            : "新規登録してログイン"}
        </Button>
      </form>
    </div>
  );
}


