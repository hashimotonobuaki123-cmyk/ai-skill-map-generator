## AI Skill Map Generator

AI がユーザーのスキル・職務経歴を解析し、スキルマップと学習ロードマップを自動生成する Next.js アプリのひな型です。

### 使用技術

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn 風 UI コンポーネント
- Supabase（@supabase/supabase-js）
- OpenAI Node SDK
- Chart.js（レーダーチャート）

### 環境変数

`.env.local` に以下を定義してください。

```bash
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### セットアップ

```bash
npm install
```

※ Supabase 側のテーブルは `supabase/schema.sql` をコンソール等で実行して作成してください。

### 開発用コマンド

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスするとアプリが表示されます。


