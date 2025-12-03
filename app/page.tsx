import { SkillForm } from "@/components/SkillForm";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sky-600">
          For your first career move
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
          スキルとキャリアを
          <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">
            {" "}
            一枚のマップ
          </span>
          に。
        </h2>
        <p className="text-sm md:text-base text-slate-700 max-w-xl leading-relaxed">
          職務経歴やスキルセットを日本語で入力するだけで、
          AI がスキルマップ・学習ロードマップ・求人マッチング・面接練習までまとめて用意します。
          <br />
          「何から始めればいいか」を、一緒にゆっくり整理していきましょう。
        </p>
      </section>
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start">
        <div className="space-y-3 text-xs text-slate-700">
          <p className="font-semibold text-slate-900">このツールでできること</p>
          <ul className="space-y-1.5">
            <li>・スキルマップと「あなたのクラス（ジョブ）」を自動生成</li>
            <li>・30日 / 90日ロードマップと今日やることの提案</li>
            <li>・気になる求人とのマッチングスコアと不足スキルの可視化</li>
            <li>・評価面談を想定した 1on1 練習とフィードバック</li>
            <li>・転職用ポートフォリオの棚卸しと Markdown 出力</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-300/50">
          <div className="border-b border-slate-100 px-4 py-2 flex items-center justify-between text-xs text-slate-600">
            <span>スキル入力フォーム</span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI Ready
            </span>
          </div>
          <div className="p-4">
            <SkillForm />
          </div>
        </div>
      </div>
    </div>
  );
}


