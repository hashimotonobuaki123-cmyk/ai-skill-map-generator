import { postJson } from "@/lib/apiClient";

type UsageMeta = Record<string, unknown>;

// 失敗しても UI には影響させない、ベストエフォートのログ送信
export async function logUsage(event: string, meta?: UsageMeta) {
  try {
    await postJson<
      {
        event: string;
        meta?: UsageMeta;
      },
      { ok: true }
    >("/api/usage-log", {
      event,
      meta
    });
  } catch {
    // ログ送信エラーは握りつぶす
  }
}


