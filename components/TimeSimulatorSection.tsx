"use client";

import { useState } from "react";
import type { SkillMapResult, TimeSimulationResult } from "@/types/skill";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { postJson } from "@/lib/apiClient";
import { logUsage } from "@/lib/usageLogger";

interface TimeSimulatorSectionProps {
  result: SkillMapResult;
}

export function TimeSimulatorSection({ result }: TimeSimulatorSectionProps) {
  const [weekdayHours, setWeekdayHours] = useState(1);
  const [weekendHours, setWeekendHours] = useState(2);
  const [months, setMonths] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<TimeSimulationResult | null>(null);

  const handleSimulate = async () => {
    setError(null);
    setLoading(true);
    try {
      void logUsage("time_simulate_clicked", {
        weekdayHours,
        weekendHours,
        months
      });
      const data = await postJson<
        { skillMapId: string; weekdayHours: number; weekendHours: number; months: number },
        TimeSimulationResult
      >("/api/time-simulate", {
        skillMapId: result.id,
        weekdayHours,
        weekendHours,
        months
      });
      setPlan(data);
    } catch (e) {
      console.error(e);
      setError(
        "学習時間シミュレーションに失敗しました。入力値を確認し、時間をおいて再度お試しください。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>学習時間シミュレーター</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        <p className="text-xs text-muted-foreground leading-relaxed">
          平日・休日に確保できる学習時間と期間を入力すると、
          現実的プランと理想プランの 2 パターンで学習ロードマップを再構成します。
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <label className="block text-xs font-medium">
              平日1日あたりの学習時間（時間）
            </label>
            <input
              type="number"
              min={0}
              max={8}
              className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={weekdayHours}
              onChange={(e) => setWeekdayHours(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">
              休日1日あたりの学習時間（時間）
            </label>
            <input
              type="number"
              min={0}
              max={12}
              className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={weekendHours}
              onChange={(e) => setWeekendHours(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">
              計画期間（ヶ月）
            </label>
            <input
              type="number"
              min={1}
              max={12}
              className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value) || 1)}
            />
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleSimulate}
          disabled={loading}
        >
          {loading ? "AI が再プランニング中..." : "この条件でプランを作り直す"}
        </Button>

        {plan && (
          <div className="space-y-3 border-t pt-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                現実的プラン
              </p>
              <p className="text-xs whitespace-pre-wrap">
                {plan.realisticPlan}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                理想プラン
              </p>
              <p className="text-xs whitespace-pre-wrap">{plan.idealPlan}</p>
            </div>
            {plan.notes && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  メモ・注意点
                </p>
                <p className="text-xs whitespace-pre-wrap">{plan.notes}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


