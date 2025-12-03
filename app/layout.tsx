import type { ReactNode } from "react";
import "./globals.css";
import { AuthButton } from "@/components/AuthButton";

export const metadata = {
  title: "AI Skill Map Generator",
  description: "AI がスキルを分析し、学習ロードマップを自動生成するツール"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 text-foreground antialiased">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-400 shadow-md shadow-sky-400/40" />
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                  AI Skill Map Generator
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <nav className="flex gap-2 text-xs md:text-sm text-slate-700">
                  <a
                    href="/"
                    className="px-3 py-1 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    ホーム
                  </a>
                  <a
                    href="/dashboard"
                    className="px-3 py-1 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    ダッシュボード
                  </a>
                  <a
                    href="/portfolio"
                    className="px-3 py-1 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    ポートフォリオ整理
                  </a>
                </nav>
                <AuthButton />
              </div>
            </div>
          </header>
          <main className="flex-1 max-w-5xl mx-auto px-4 py-8">
            <div className="relative rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.15)] overflow-hidden">
              <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_60%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.15),transparent_55%)]" />
              <div className="relative p-6 md:p-8">{children}</div>
            </div>
          </main>
          <footer className="border-t border-slate-200 text-xs text-slate-500 py-4 text-center">
            © {new Date().getFullYear()} AI Skill Map Generator
          </footer>
        </div>
      </body>
    </html>
  );
}


