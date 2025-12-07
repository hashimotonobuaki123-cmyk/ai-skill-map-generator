"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  OneOnOneFeedback,
  OneOnOneQuestions,
  SkillMapResult,
  InterviewSessionSummary,
  InterviewSessionRecord
} from "@/types/skill";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson } from "@/lib/apiClient";
import { logUsage } from "@/lib/usageLogger";

type InterviewType = "general" | "technical" | "behavioral";

interface OneOnOnePracticeSectionProps {
  result: SkillMapResult;
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i < current
              ? "bg-emerald-500"
              : i === current
              ? "bg-sky-500 scale-125"
              : "bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

export function OneOnOnePracticeSection({
  result
}: OneOnOnePracticeSectionProps) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<OneOnOneFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interviewType, setInterviewType] = useState<InterviewType>("general");
  const [exchanges, setExchanges] = useState<
    { question: string; answer: string; feedback: string }[]
  >([]);
  const [sessionSummary, setSessionSummary] =
    useState<InterviewSessionSummary | null>(null);
  const [savingSession, setSavingSession] = useState(false);
  const [sessions, setSessions] = useState<InterviewSessionRecord[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const loadSessions = useCallback(async () => {
    try {
      setSessionsLoading(true);
      const res = await fetch(
        `/api/oneonone/sessions?skillMapId=${encodeURIComponent(
          result.id
        )}&limit=5`,
        { cache: "no-store" }
      );
      if (!res.ok) {
        throw new Error("failed to fetch sessions");
      }
      const data = (await res.json()) as {
        sessions?: InterviewSessionRecord[];
      };
      setSessions(data.sessions ?? []);
    } catch (e) {
      console.error("Failed to load interview sessions", e);
    } finally {
      setSessionsLoading(false);
    }
  }, [result.id]);

  useEffect(() => {
    const loadQuestions = async () => {
      setError(null);
      setQuestionsLoading(true);
      try {
        const data = await postJson<
          { skillMapId: string; interviewType?: InterviewType },
          OneOnOneQuestions
        >("/api/oneonone/questions", {
          skillMapId: result.id,
          interviewType
        });
        setQuestions(data.questions ?? []);
      } catch (e) {
        console.error(e);
        setError(
          "1on1 の質問取得に失敗しました。時間をおいてから、もう一度お試しください。"
        );
      } finally {
        setQuestionsLoading(false);
      }
    };

    loadQuestions();
  }, [result.id, interviewType]);

  // セッション履歴読み込み
  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  const currentQuestion = questions[currentIndex] ?? null;

  const handleFeedback = async () => {
    if (!currentQuestion || !answer.trim()) {
      setError("質問への回答を入力してください。");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      void logUsage("oneonone_feedback_clicked");
      const data = await postJson<
        {
          question: string;
          answer: string;
          strengths: string;
          weaknesses: string;
          interviewType?: InterviewType;
        },
        OneOnOneFeedback
      >("/api/oneonone/feedback", {
        question: currentQuestion,
        answer,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        interviewType
      });
      setFeedback(data);
      setExchanges((prev) => [
        ...prev,
        { question: currentQuestion, answer, feedback: data.feedback }
      ]);
    } catch (e) {
      console.error(e);
      setError(
        "フィードバックの取得に失敗しました。回答内容を確認し、時間をおいて再度お試しください。"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setAnswer("");
    setCurrentIndex((idx) =>
      idx + 1 < questions.length ? idx + 1 : questions.length - 1
    );
  };

  const handleSaveSession = async () => {
    if (!exchanges.length) {
      setError("少なくとも1問はフィードバックを受けてから保存してください。");
      return;
    }
    setSavingSession(true);
    setError(null);
    try {
      // 1. セッション総評を生成
      const summary = await postJson<
        {
          interviewType: InterviewType;
          exchanges: { question: string; answer: string; feedback: string }[];
          strengths?: string;
          weaknesses?: string;
        },
        InterviewSessionSummary
      >("/api/oneonone/summary", {
        interviewType,
        exchanges,
        strengths: result.strengths,
        weaknesses: result.weaknesses
      });

      setSessionSummary(summary);

      // 2. セッションを保存
      await postJson<
        {
          skillMapId: string;
          interviewType: InterviewType;
          questionCount: number;
          overallScore?: number;
          strongPoints?: string[];
          improvementPoints?: string[];
          nextSteps?: string[];
          summary?: string;
          exchanges: { question: string; answer: string; feedback: string }[];
        },
        { session: InterviewSessionRecord }
      >("/api/oneonone/sessions", {
        skillMapId: result.id,
        interviewType,
        questionCount: exchanges.length,
        overallScore: summary.overallScore,
        strongPoints: summary.strongPoints,
        improvementPoints: summary.improvementPoints,
        nextSteps: summary.nextSteps,
        summary: summary.summary,
        exchanges
      });

      void logUsage("oneonone_session_saved", {
        interviewType,
        questionCount: exchanges.length,
        overallScore: summary.overallScore
      });

      // 3. 履歴を再読み込み
      void loadSessions();
    } catch (e) {
      console.error(e);
      setError(
        "セッションの保存に失敗しました。時間をおいてから、もう一度お試しください。"
      );
    } finally {
      setSavingSession(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50">
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white shadow-md">
            🎤
          </span>
          1on1 練習モード
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <p className="text-xs text-slate-600 leading-relaxed">
          評価面談でよく聞かれる質問に対して回答を考え、AI マネージャーからフィードバックと模範回答をもらえます。
        </p>

        {/* 面接タイプ選択 */}
        <div className="flex flex-wrap gap-2 text-[11px]">
          {[
            {
              id: "general" as InterviewType,
              label: "総合",
              desc: "自己紹介・志望動機など",
              emoji: "🗣️"
            },
            {
              id: "technical" as InterviewType,
              label: "技術",
              desc: "技術選定・課題解決",
              emoji: "🧪"
            },
            {
              id: "behavioral" as InterviewType,
              label: "行動 (STAR)",
              desc: "行動・成果エピソード",
              emoji: "📚"
            }
          ].map((t) => {
            const active = interviewType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setInterviewType(t.id);
                  setCurrentIndex(0);
                  setFeedback(null);
                  setAnswer("");
                }}
                className={`flex-1 min-w-[96px] px-3 py-2 rounded-lg border text-left transition-all ${
                  active
                    ? "border-violet-400 bg-white shadow-sm text-violet-700"
                    : "border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span aria-hidden="true">{t.emoji}</span>
                  <span className="font-semibold">{t.label}</span>
                </div>
                <p className="text-[10px] text-slate-500">{t.desc}</p>
              </button>
            );
          })}
        </div>

        {error && <ErrorAlert message={error} />}

        {questionsLoading ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
            <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-600">質問を準備しています...</span>
          </div>
        ) : !currentQuestion ? (
          <div className="text-center py-8">
            <span className="text-4xl">😢</span>
            <p className="text-sm text-slate-500 mt-2">
              質問の取得に失敗しました
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {/* Progress */}
            <div className="flex items-center justify-between">
              <ProgressDots current={currentIndex} total={questions.length} />
              <span className="text-xs text-slate-500">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>

            {/* Question */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                  Q
                </div>
                <p className="text-sm text-slate-800 leading-relaxed pt-1">
                  {currentQuestion}
                </p>
              </div>
            </div>

            {/* Answer input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <span>💬</span>
                あなたの回答
              </label>
              <div className="relative">
                <textarea
                  className="w-full min-h-[140px] rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition-all duration-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 focus:outline-none resize-none"
                  placeholder="実際の1on1で話すつもりで、できるだけ具体的に書いてみてください。"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      e.preventDefault();
                      void handleFeedback();
                    }
                  }}
                />
                <div className="absolute bottom-2 right-2 text-[10px] text-slate-400">
                  ⌘+Enter で送信
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={handleFeedback}
                disabled={loading || !answer.trim()}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    AI がレビュー中...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    フィードバックをもらう
                  </>
                )}
              </Button>
              {feedback && currentIndex + 1 < questions.length && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleNext}
                >
                  次の質問へ →
                </Button>
              )}
            </div>

            {/* Feedback */}
            {feedback && (
              <div className="space-y-4 pt-4 border-t border-slate-100 animate-fade-in-up">
                {typeof feedback.ruleBasedScore === "number" && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        総合スコア（自己評価）
                      </p>
                      <p className="text-[11px] text-slate-500">
                        文字数・具体性・構造・STAR要素をもとに採点しています。
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-violet-600">
                        {feedback.ruleBasedScore}
                        <span className="text-xs text-slate-500"> / 100</span>
                      </p>
                    </div>
                  </div>
                )}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                      💡
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-amber-700 mb-1">
                        フィードバック
                      </p>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {feedback.feedback}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-emerald-700 mb-1">
                        模範回答の例
                      </p>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {feedback.improvedAnswer}
                      </p>
                    </div>
                  </div>
                </div>

                {/* セッション総評ボタン */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSaveSession}
                    disabled={savingSession || !exchanges.length}
                  >
                    {savingSession ? "セッションを保存中..." : "セッションを保存して総評を見る"}
                  </Button>
                </div>

                {/* セッション総評表示 */}
                {sessionSummary && (
                  <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <span>📊</span>
                      今回のセッション総評
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-violet-600">
                          {sessionSummary.overallScore}
                        </span>
                        <span className="text-xs text-slate-500">/ 5</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        1 が要改善、5 がとても良い状態の目安です。
                      </p>
                    </div>
                    {!!sessionSummary.strongPoints.length && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-emerald-700">
                          良かった点
                        </p>
                        <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                          {sessionSummary.strongPoints.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {!!sessionSummary.improvementPoints.length && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-amber-700">
                          改善すると良い点
                        </p>
                        <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                          {sessionSummary.improvementPoints.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {!!sessionSummary.nextSteps.length && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-sky-700">
                          次回までにやること
                        </p>
                        <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                          {sessionSummary.nextSteps.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {sessionSummary.summary && (
                      <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {sessionSummary.summary}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {/* 履歴一覧 */}
        <div className="mt-6 border-t border-slate-100 pt-4 space-y-2">
          <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <span>🕒</span>
            過去の 1on1 セッション履歴（直近 5 件）
          </p>
          {sessionsLoading ? (
            <p className="text-xs text-slate-500">読み込み中...</p>
          ) : sessions.length === 0 ? (
            <p className="text-xs text-slate-500">
              まだ保存されたセッションはありません。1問以上フィードバックを受けて「セッションを保存して総評を見る」を押すと、ここに履歴が表示されます。
            </p>
          ) : (
            <ul className="space-y-1.5">
              {sessions.map((s) => {
                const created = s.created_at
                  ? new Date(s.created_at)
                  : null;
                return (
                  <li
                    key={s.id}
                    className="text-xs text-slate-700 flex items-center justify-between gap-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {s.interview_type ?? "unknown"}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {created
                          ? created.toLocaleString("ja-JP", {
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : "-"}
                      </span>
                    </div>
                    <div className="text-right text-[11px] text-slate-600">
                      <span className="mr-2">
                        質問数: {s.question_count ?? "-"}
                      </span>
                      <span>
                        スコア: {s.overall_score ?? "-"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
