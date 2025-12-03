## AI Skill Map Generator

若手 Web エンジニアの「初めての転職」を想定した、AI ベースのスキルマップ・キャリアコーチングツールです。  
スキル・職務経歴を入力すると、スキルマップ / 学習ロードマップ / 求人マッチング / 面接練習 / ポートフォリオ整理まで一通りサポートします。

### 機能概要

- スキルマップ生成（Frontend / Backend / Infra / AI / Tools）＋強み・弱みの分析
- クラス表示（フロントエンドメイジ等）とプロフィールストーリー自動生成
- 30日 / 90日ロードマップ＋学習時間シミュレーター＋「今日やること」提案
- キャリアリスクレーダー（陳腐化 / 属人化 / 自動化リスク）
- 求人票マッチングスコア（マッチ度%・不足スキル・求人向けミニロードマップ）
- 1on1 練習モード（想定質問 + 回答へのフィードバック・模範回答）
- ポートフォリオ棚卸しジェネレーター（案件TOP3とMarkdown出力）

### 使用技術

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn 風 UI コンポーネント
- OpenAI Node SDK
- Supabase JS Client
- Chart.js（レーダーチャート）

### 環境変数

プロジェクト直下に `.env.local` を作成し、以下を定義してください。

```bash
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### セットアップ

```bash
npm install --legacy-peer-deps
```

※ Next.js 15 / React 19 RC と一部ライブラリの peerDependencies の都合で、`--legacy-peer-deps` を付けてインストールする想定です。  
※ Supabase 側のテーブルは `supabase/schema.sql` をコンソール等で実行して作成してください。

### 開発用コマンド

```bash
npm run dev      # 開発サーバ
npm run test     # 転職準備スコアなどのユニットテスト
npm run test:e2e # Playwright による簡易E2Eテスト
```

`npm run dev` 実行後、ターミナルに表示される **Local** の URL（例: `http://localhost:3002`）にブラウザでアクセスするとアプリが表示されます（ホーム `/` からスキル診断を開始できます）。

### アーキテクチャ概要

- フロントエンド
  - `app/page.tsx`：スキル入力フォーム（キャリアゴール・職務経歴・GitHub URL）
  - `app/result/[id]/page.tsx`：スキルマップ結果・ロードマップ・求人マッチング・1on1 などのタブ表示
  - `app/dashboard/page.tsx`：過去のスキルマップ一覧とメイン強みバッジ
- バックエンド（Next.js API Routes）
  - `/api/generate`：OpenAI にスキル分析を依頼し、Supabase の `skill_maps` に保存
  - `/api/job-match`：求人票テキスト/URLとスキルマップからマッチングスコア・不足スキル・求人向けロードマップを生成
  - `/api/risk`：キャリアリスク（陳腐化 / 属人化 / 自動化）をスコアリング
  - `/api/readiness`：`lib/readiness.ts` の純粋関数で「転職準備スコア」を算出
  - その他 `/api/oneonone/*`, `/api/time-simulate`, `/api/portfolio`, `/api/today-task` などの補助 API 群
- データストア
  - Supabase Postgres の `skill_maps` テーブルに解析結果を保存
  - 必要に応じて `profiles` でユーザープロファイルを管理

### 典型的なユーザーフロー

1. ホームで「目指したいキャリア」を選び、スキル・職務経歴・GitHub URL を入力して診断を実行  
2. 結果画面で「スキル全体像」タブを開き、レーダーチャート・おすすめスキル・転職準備スコアをざっと確認  
3. 「キャリア・求人」タブで気になる求人票を貼り付け、マッチングスコアと不足スキルを確認  
4. 「面接練習」タブで 1on1 質問に答え、フィードバックを受ける  
5. 「職務経歴書用」タブから Markdown / JSON / 職務経歴書テンプレをコピーして、応募準備に活用

### 品質とテスト

- API 入力はすべて Zod スキーマ（`types/api.ts`）でバリデーションし、型と runtime の整合性を担保しています。
- 転職準備スコアの算出ロジックは `lib/readiness.ts` の純粋関数として切り出し、`lib/readiness.test.ts` で high / medium / low の3パターンをユニットテストしています。
- フロントエンドからの API 呼び出しは `lib/apiClient.ts` の `postJson` を通すことで、エラーハンドリングと型付けを共通化しています。
- `tests/e2e/basic-flow.spec.ts` で、ホーム画面が表示されスキル入力フォームが存在することを Playwright で自動チェックしています。

### 認証（メールアドレス + パスワード）

- Supabase Auth の設定で Email 認証を有効化し、開発中はメール確認をオフにしておくと動作確認しやすいです。  
- 画面右上の「ログイン」ボタンから `/auth/login` に遷移し、メールアドレスとパスワードで新規登録 / ログインできます。  
- ログインすると `auth.getUser().id` が `skill_maps.user_id` に保存され、`/dashboard` ではそのユーザーに紐づく診断結果のみを一覧表示します（未ログイン時は全体の履歴をデモ用として参照）。