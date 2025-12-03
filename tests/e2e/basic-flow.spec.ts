import { test, expect } from "@playwright/test";

// 外部APIに依存しない、最小限のE2Eテスト（ホーム画面の表示確認）
test("ホーム画面が表示され、スキル入力フォームが存在する", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "スキルとキャリアを 一枚のマップ に。" })
  ).toBeVisible();

  await expect(
    page.getByText("スキル入力フォーム", { exact: false })
  ).toBeVisible();
});


