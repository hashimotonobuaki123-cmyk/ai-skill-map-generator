/**
 * スキルカテゴリの定義
 * 各カテゴリは0-5のレベルで評価
 */
export interface SkillCategories {
  /** フロントエンド開発スキル (0-5) */
  frontend?: number;
  /** バックエンド開発スキル (0-5) */
  backend?: number;
  /** インフラ・DevOpsスキル (0-5) */
  infra?: number;
  /** AI・機械学習スキル (0-5) */
  ai?: number;
  /** 開発ツール・ワークフロースキル (0-5) */
  tools?: number;
}

/** スキルカテゴリのキー */
export type SkillCategoryKey = keyof SkillCategories;

/** スキルレベル (0-5) */
export type SkillLevel = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Chart.js レーダーチャート用のデータ構造
 */
export interface ChartData {
  labels?: string[];
  data?: number[];
  datasets?: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }>;
  nextSkills?: string[];
}

/**
 * スキルマップ解析結果
 */
export interface SkillMapResult {
  /** 一意のID */
  id: string;
  /** 元の入力テキスト */
  rawInput: string;
  /** カテゴリ別スキルレベル */
  categories: SkillCategories;
  /** 強みの分析結果 */
  strengths: string;
  /** 弱みの分析結果 */
  weaknesses: string;
  /** 次に習得すべきおすすめスキル */
  nextSkills?: string[];
  /** 30日ロードマップ */
  roadmap30: string;
  /** 90日ロードマップ */
  roadmap90: string;
  /** チャートデータ */
  chartData: ChartData | null;
}

/**
 * 求人票マッチング結果
 */
export interface JobMatchResult {
  /** マッチングスコア (0-100) */
  score: number;
  /** マッチしているスキル */
  matchedSkills: string[];
  /** 不足しているスキル */
  missingSkills: string[];
  /** マッチングの要約 */
  summary: string;
  /** この求人に寄せるためのロードマップ */
  roadmapForJob: string;
}

/**
 * キャリアリスク評価結果
 */
export interface CareerRiskResult {
  /** 技術の陳腐化リスク (0-100) */
  obsolescence: number;
  /** 属人化リスク (0-100) */
  busFactor: number;
  /** 自動化・AI置換リスク (0-100) */
  automation: number;
  /** リスクの要約 */
  summary: string;
  /** 回避アクションの提案 */
  actions: string;
}

/**
 * 1on1 練習用の質問
 */
export interface OneOnOneQuestions {
  /** 質問リスト */
  questions: string[];
}

/**
 * 1on1 フィードバック結果
 */
export interface OneOnOneFeedback {
  /** フィードバック内容 */
  feedback: string;
  /** 改善された回答例 */
  improvedAnswer: string;
  /** ルールベース評価の総合スコア (0-100) */
  ruleBasedScore?: number;
  /** ルールベース評価の内訳スコア */
  ruleBasedScores?: {
    length: number;
    specificity: number;
    structure: number;
    starElements: number;
  };
}

/**
 * 1on1 セッション総評結果
 */
export interface InterviewSessionSummary {
  /** 総合スコア (1-5) */
  overallScore: number;
  /** 良かった点 */
  strongPoints: string[];
  /** 改善点 */
  improvementPoints: string[];
  /** 次回までにやること */
  nextSteps: string[];
  /** 総評コメント */
  summary: string;
}

/**
 * 1on1 セッション履歴レコード（Supabaseの interview_sessions テーブルに対応）
 */
export interface InterviewSessionRecord {
  id: string;
  skill_map_id: string | null;
  interview_type: string | null;
  question_count: number | null;
  overall_score: number | null;
  strong_points: string[] | null;
  improvement_points: string[] | null;
  next_steps: string[] | null;
  summary: string | null;
  exchanges: {
    question: string;
    answer: string;
    feedback: string;
  }[] | null;
  created_at: string;
}

/**
 * 学習時間シミュレーション結果
 */
export interface TimeSimulationResult {
  /** 現実的プラン */
  realisticPlan: string;
  /** 理想プラン */
  idealPlan: string;
  /** 補足・注意点 */
  notes: string;
}

/**
 * 今日のタスク結果
 */
export interface TodayTaskResult {
  /** タスクタイトル */
  title: string;
  /** タスクの説明 */
  description: string;
  /** 手順 */
  steps: string;
  /** 推定所要時間（時間） */
  estimatedHours: number;
}

/** 転職準備レベル */
export type ReadinessLevel = "low" | "medium" | "high";

/**
 * 転職準備スコア結果
 */
export interface ReadinessScoreResult {
  /** スコア (0-100) */
  score: number;
  /** レベル */
  level: ReadinessLevel;
  /** コメント */
  comment: string;
}

/**
 * ポートフォリオアイテムのサマリー
 */
export interface PortfolioItemSummary {
  /** プロジェクトタイトル */
  title: string;
  /** プロジェクトURL */
  url?: string;
  /** 概要 */
  summary: string;
  /** アピールポイント */
  sellingPoints: string;
  /** 振り返り */
  reflection: string;
}

/**
 * ポートフォリオ生成結果
 */
export interface PortfolioGeneratorResult {
  /** 選ばれたポートフォリオアイテム */
  items: PortfolioItemSummary[];
  /** Markdown形式の出力 */
  markdown: string;
}

/**
 * キャリアゴールの選択肢
 */
export type CareerGoal =
  | "frontend_specialist"
  | "fullstack"
  | "backend_api"
  | "tech_lead"
  | "unsure";

/**
 * キャリアゴールの表示情報
 */
export interface CareerGoalInfo {
  value: CareerGoal;
  label: string;
  emoji: string;
  description: string;
}

/**
 * スキルマップ一覧アイテム
 */
export interface SkillMapListItem {
  id: string;
  createdAt: string;
  categories: SkillCategories;
  userId: string | null;
}
