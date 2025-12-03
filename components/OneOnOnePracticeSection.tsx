"use client";

import { useEffect, useState } from "react";
import type {
  OneOnOneFeedback,
  OneOnOneQuestions,
  SkillMapResult
} from "@/types/skill";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson } from "@/lib/apiClient";
import { logUsage } from "@/lib/usageLogger";

interface OneOnOnePracticeSectionProps {
  result: SkillMapResult;
}

export function OneOnOnePracticeSection({
  result
}: OneOnOnePracticeSectionProps) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<OneOnOneFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      setError(null);
      try {
        const data = await postJson<{ skillMapId: string }, OneOnOneQuestions>(
          "/api/oneonone/questions",
          { skillMapId: result.id }
        );
        setQuestions(data.questions ?? []);
      } catch (e) {
        console.error(e);
        setError(
          "1on1 の質問取得に失敗しました。時間をおいてから、もう一度お試しください。"
        );
      }
    };

    loadQuestions();
  }, [result.id]);

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
        },
        OneOnOneFeedback
      >("/api/oneonone/feedback", {
        question: currentQuestion,
        answer,
        strengths: result.strengths,
        weaknesses: result.weaknesses
      });
      setFeedback(data);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>1on1 練習モード</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        <p className="text-xs text-muted-foreground leading-relaxed">
          評価面談でよく聞かれる質問に対して回答を考え、AI マネージャーからフィードバックと模範回答をもらえます。
        </p>

        {error && <ErrorAlert message={error} />}

        {!currentQuestion ? (
          <p className="text-xs text-muted-foreground">
            質問を読み込み中、または取得に失敗しました。
          </p>
        ) : (
          <>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                質問 {currentIndex + 1} / {questions.length || 1}
              </p>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {currentQuestion}
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium">あなたの回答</label>
              <textarea
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleFeedback}
                disabled={loading}
              >
                {loading ? "AI がレビュー中..." : "フィードバックをもらう"}
              </Button>
              {feedback && currentIndex + 1 < questions.length && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleNext}
                >
                  次の質問へ
                </Button>
              )}
            </div>

            {feedback && (
              <div className="space-y-3 border-t pt-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    フィードバック
                  </p>
                  <p className="text-xs whitespace-pre-wrap">
                    {feedback.feedback}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    模範回答の例
                  </p>
                  <p className="text-xs whitespace-pre-wrap">
                    {feedback.improvedAnswer}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}


