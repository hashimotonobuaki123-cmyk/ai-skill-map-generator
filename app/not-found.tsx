import Link from "next/link";

export const dynamic = "force-dynamic";

/**
 * カスタム 404 ページ
 */
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in-up">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-emerald-400 shadow-xl shadow-indigo-400/40 flex items-center justify-center text-2xl font-black text-white">
            SM
          </div>
        </div>

        {/* Error message */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-slate-900">404</h1>
          <h2 className="text-xl font-semibold text-slate-700">
            ページが見つかりません
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            お探しのページは存在しないか、移動した可能性があります。
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-200"
          >
            <span>🏠</span>
            ホームに戻る
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
          >
            <span>📊</span>
            ダッシュボード
          </Link>
        </div>
      </div>
    </div>
  );
}

