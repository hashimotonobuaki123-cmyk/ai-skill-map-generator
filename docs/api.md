# API 仕様（サマリ）

Zod スキーマは `types/api.ts` に定義しており、ここではエンドポイントと主な入出力だけを整理します。

## POST /api/generate

- 用途: スキルマップ生成
- 入力:
  - `text: string` スキル・職務経歴
  - `repoUrl?: string`
  - `goal: string`
  - `userId?: string`
- 出力:
  - `id: string` 生成された `skill_maps` の ID

## POST /api/readiness

- 用途: 転職準備スコア計算
- 入力:
  - `skillMapId: string`
  - `jobMatchScore?: number`
  - `riskObsolescence?: number`
  - `riskBusFactor?: number`
  - `riskAutomation?: number`
  - `prepScore?: number`
- 出力:
  - `score: number`
  - `level: "high" | "medium" | "low"`
  - `comment: string`

## POST /api/job-match

- 用途: 求人票マッチング
- 入力:
  - `skillMapId: string`
  - `jdText?: string`
  - `jobUrl?: string`
- 出力:
  - `score: number`
  - `matchedSkills: string[]`
  - `missingSkills: string[]`
  - `summary: string`
  - `roadmapForJob: string`

## POST /api/risk

- 用途: キャリアリスクスコア算出
- 入力:
  - `skillMapId: string`
- 出力（例）:
  - `obsolescence: number`
  - `busFactor: number`
  - `automation: number`
  - `advice: string`

## POST /api/portfolio

- 用途: ポートフォリオ棚卸し
- 入力:
  - `urls: string[]`
- 出力:
  - `items: { title: string; description: string; appeal: string; markdown: string }[]`

## POST /api/today-task

- 用途: 30 / 90 日ロードマップから「今日やること」を 1 つ提案
- 入力:
  - `skillMapId: string`
- 出力:
  - `task: string`
  - `reason: string`

## POST /api/usage-log

- 用途: 機能利用ログの記録
- 入力:
  - `event: string`
  - `meta?: Record<string, unknown>`
- 出力:
  - `{ ok: true }`

その他、1on1 質問生成や学習時間シミュレーションなどの補助 API も `types/api.ts` で型定義済みです。


