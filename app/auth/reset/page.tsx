"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim() || !confirm.trim()) {
      setError("新しいパスワードを2回入力してください。");
      return;
    }

    if (password !== confirm) {
      setError("パスワードが一致していません。もう一度確認してください。");
      return;
    }

    if (password.length < 8) {
      setError("パスワードは8文字以上を推奨します。");
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({
        password
      });
      if (error) {
        throw error;
      }
      setDone(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (e) {
      console.error(e);
      setError(
        "パスワードの更新に失敗しました。リンクの有効期限が切れている可能性があります。もう一度メールからアクセスしてください。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <div>
        <h2 className="text-xl font-semibold">パスワードの再設定</h2>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          受信したメールのリンクからこのページにアクセスしている場合、
          新しいパスワードを設定できます。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div className="space-y-1">
          <label className="block text-xs font-medium">新しいパスワード</label>
          <input
            type="password"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8文字以上を推奨"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium">
            新しいパスワード（確認）
          </label>
          <input
            type="password"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="もう一度入力してください"
          />
        </div>

        {error && <ErrorAlert message={error} />}
        {done && !error && (
          <p className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-2 py-1">
            パスワードを更新しました。ログイン画面に戻ります。
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full mt-1">
          {loading ? "更新中..." : "パスワードを更新する"}
        </Button>
      </form>
    </div>
  );
}


