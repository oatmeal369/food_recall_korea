import { fetchI0490Rows, I0490_SOURCE_NAME } from "../src/foodsafetyApi.js";
import { normalizeRecallItem } from "../src/normalizer.js";

function getQueryValue(request, key, fallback) {
  if (request.query?.[key]) return request.query[key];
  const url = new URL(request.url || "/", "http://localhost");
  return url.searchParams.get(key) || fallback;
}

export default async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method && request.method !== "GET") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const fetched = await fetchI0490Rows({
      explicitUrl: process.env.FOODSAFETY_API_URL?.trim(),
      serviceKey: process.env.FOODSAFETY_SERVICE_KEY?.trim() || "sample",
      format: getQueryValue(request, "format", process.env.FOODSAFETY_FORMAT || "json"),
      start: getQueryValue(request, "start", process.env.FOODSAFETY_START || "1"),
      end: getQueryValue(request, "end", process.env.FOODSAFETY_END || "1000")
    });

    const updatedAt = new Date().toISOString();
    const items = fetched.rows.map((row, index) => normalizeRecallItem(row, index));

    response.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    response.status(200).json({
      source: I0490_SOURCE_NAME,
      sourceUrl: fetched.sourceUrl,
      updatedAt,
      totalCount: fetched.totalCount,
      count: items.length,
      result: fetched.result,
      items
    });
  } catch (error) {
    response.status(500).json({
      source: I0490_SOURCE_NAME,
      error: error.message
    });
  }
}
