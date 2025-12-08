import { test, expect } from "@playwright/test";

// 手元でのみ実行するスクショ用シナリオ
test.skip(
  !!process.env.CI,
  "CI ではマーケ用スクリーンショット生成はスキップします"
);

// ベースURL: 環境変数があればそれを、なければ本番URLを使う
const baseUrl =
  process.env.PLAYWRIGHT_BASE_URL ?? "https://ai-skill-map-generator.vercel.app";

const OUTPUT_DIR = "public/screenshots/portfolio";

test("Portfolio screenshots (desktop & mobile, EN UI)", async ({ page }) => {
  // 1) Desktop dashboard
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseUrl}/en/dashboard?demo=2`);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(5000);
  await page.screenshot({
    path: `${OUTPUT_DIR}/1_dashboard.png`,
    fullPage: true
  });

  // 2) Desktop skill input close-up
  await page.goto(`${baseUrl}/en?demo=1`);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(4000);

  const formLocator = page.locator("form").first();
  if (await formLocator.count()) {
    await formLocator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await formLocator.screenshot({
      path: `${OUTPUT_DIR}/2_skill_input.png`
    });
  } else {
    // 未ログインなどでフォームが表示されていない場合は、メインカード部分を撮る
    const mainCard = page.locator("main").first();
    await mainCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await mainCard.screenshot({
      path: `${OUTPUT_DIR}/2_skill_input.png`
    });
  }

  // 4) i18n toggle (header with EN/JP switch visible)
  await page.goto(`${baseUrl}/en`);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(2000);
  const header = page.locator("header").first();
  await header.screenshot({
    path: `${OUTPUT_DIR}/4_i18n_toggle.png`
  });

  // 5) Mobile dashboard
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/en/dashboard?demo=2`);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(5000);
  await page.screenshot({
    path: `${OUTPUT_DIR}/5_mobile_dashboard.png`,
    fullPage: true
  });
});


