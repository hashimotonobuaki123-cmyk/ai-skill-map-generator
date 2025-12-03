import { describe, it, expect } from "vitest";
import { calculateReadinessScore } from "./readiness";

const baseCategories = {
  frontend: 3,
  backend: 3,
  infra: 3,
  ai: 3,
  tools: 3
} as const;

describe("calculateReadinessScore", () => {
  it("高スコアの場合は high レベルになる", () => {
    const result = calculateReadinessScore({
      categories: {
        frontend: 5,
        backend: 5,
        infra: 4,
        ai: 4,
        tools: 5
      },
      jobMatchScore: 90,
      riskObsolescence: 20,
      riskBusFactor: 20,
      riskAutomation: 20,
      prepScore: 9
    });

    expect(result.level).toBe("high");
    expect(result.score).toBeGreaterThanOrEqual(75);
  });

  it("中くらいのケースでは medium レベルになる", () => {
    const result = calculateReadinessScore({
      categories: baseCategories,
      jobMatchScore: 60,
      riskObsolescence: 50,
      riskBusFactor: 50,
      riskAutomation: 50,
      prepScore: 5
    });

    expect(result.level).toBe("medium");
  });

  it("スキルや準備が弱くリスクが高い場合は low レベルになる", () => {
    const result = calculateReadinessScore({
      categories: {
        frontend: 1,
        backend: 1,
        infra: 1,
        ai: 1,
        tools: 1
      },
      jobMatchScore: 20,
      riskObsolescence: 80,
      riskBusFactor: 80,
      riskAutomation: 80,
      prepScore: 1
    });

    expect(result.level).toBe("low");
  });
});


