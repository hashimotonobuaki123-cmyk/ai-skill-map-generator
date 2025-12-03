export type SkillCategories = {
  frontend?: number;
  backend?: number;
  infra?: number;
  ai?: number;
  tools?: number;
};

export type SkillMapResult = {
  id: string;
  rawInput: string;
  categories: SkillCategories;
  strengths: string;
  weaknesses: string;
  // 次に習得すべきおすすめスキル
  nextSkills?: string[];
  roadmap30: string;
  roadmap90: string;
  // Chart.js レーダーチャート用のデータ構造
  chartData: any;
};

// 求人票マッチング結果
export type JobMatchResult = {
  score: number; // 0-100
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
  roadmapForJob: string;
};

// キャリアリスク評価結果
export type CareerRiskResult = {
  obsolescence: number; // 技術の陳腐化リスク 0-100
  busFactor: number; // 属人化リスク 0-100
  automation: number; // 自動化・AI置換リスク 0-100
  summary: string;
  actions: string; // 回避アクションの提案
};

// 1on1 練習用
export type OneOnOneQuestions = {
  questions: string[];
};

export type OneOnOneFeedback = {
  feedback: string;
  improvedAnswer: string;
};

// 学習時間シミュレーター
export type TimeSimulationResult = {
  realisticPlan: string; // 現実的プラン
  idealPlan: string; // 理想プラン
  notes: string; // 補足・注意点
};

// 今日やることカード
export type TodayTaskResult = {
  title: string;
  description: string;
  steps: string;
  estimatedHours: number;
};

// 転職準備スコア
export type ReadinessScoreResult = {
  score: number; // 0-100
  level: "low" | "medium" | "high";
  comment: string;
};

// ポートフォリオ棚卸し
export type PortfolioItemSummary = {
  title: string;
  url?: string;
  summary: string;
  sellingPoints: string;
  reflection: string;
};

export type PortfolioGeneratorResult = {
  items: PortfolioItemSummary[];
  markdown: string; // Notion/Markdown に貼り付けられる一覧
};


