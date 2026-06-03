import { mkdir, writeFile } from "node:fs/promises";
import { fetchI0490Rows, I0490_SOURCE_NAME } from "../src/foodsafetyApi.js";
import { normalizeRecallItem } from "../src/normalizer.js";

function getFetchOptions() {
  const env = globalThis.process?.env || {};
  return {
    explicitUrl: env.FOODSAFETY_API_URL?.trim(),
    serviceKey: env.FOODSAFETY_SERVICE_KEY?.trim() || "sample",
    format: (env.FOODSAFETY_FORMAT || "json").trim().toLowerCase(),
    start: env.FOODSAFETY_START || "1",
    end: env.FOODSAFETY_END || "1000"
  };
}

async function main() {
  const fetched = await fetchI0490Rows(getFetchOptions());
  const updatedAt = new Date().toISOString();
  const normalizedItems = fetched.rows.map((row, index) => normalizeRecallItem(row, index));

  await mkdir("data", { recursive: true });
  await writeFile("data/i0490-raw.json", `${JSON.stringify({
    source: I0490_SOURCE_NAME,
    sourceUrl: fetched.sourceUrl,
    updatedAt,
    totalCount: fetched.totalCount,
    count: fetched.rows.length,
    result: fetched.result,
    rows: fetched.rows
  }, null, 2)}\n`, "utf8");

  await writeFile("data/recalls.json", `${JSON.stringify({
    source: I0490_SOURCE_NAME,
    sourceUrl: fetched.sourceUrl,
    updatedAt,
    totalCount: fetched.totalCount,
    count: normalizedItems.length,
    items: normalizedItems
  }, null, 2)}\n`, "utf8");

  console.log(`Updated data/recalls.json with ${normalizedItems.length} rows.`);
}

await main().catch((error) => {
  console.error(error);
  if (globalThis.process) {
    globalThis.process.exitCode = 1;
  } else {
    throw error;
  }
});
