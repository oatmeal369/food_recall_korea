import { mkdir, writeFile } from "node:fs/promises";
import { normalizeRecallItem } from "../src/normalizer.js";

const API_CODE = "I0490";
const SOURCE_NAME = "식품안전나라 I0490";

function buildApiUrl() {
  const env = globalThis.process?.env || {};
  const explicitUrl = env.FOODSAFETY_API_URL?.trim();
  if (explicitUrl) return explicitUrl;

  const serviceKey = env.FOODSAFETY_SERVICE_KEY?.trim() || "sample";
  const format = (env.FOODSAFETY_FORMAT || "json").trim().toLowerCase();
  const start = env.FOODSAFETY_START || "1";
  const end = env.FOODSAFETY_END || "1000";

  return `http://openapi.foodsafetykorea.go.kr/api/${encodeURIComponent(serviceKey)}/${API_CODE}/${format}/${start}/${end}`;
}

function redactServiceKey(url) {
  return url.replace(/\/api\/([^/]+)\//, (_match, key) => `/api/${key === "sample" ? "sample" : "<SERVICE_KEY>"}/`);
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function parseJsonPayload(text) {
  const payload = JSON.parse(text);
  const root = payload[API_CODE] || payload.I0490 || payload;
  const rows = asArray(root.row || root.rows || payload.row || payload.rows);
  const totalCount = Number(root.total_count || root.totalCount || rows.length);
  const result = root.RESULT || payload.RESULT || null;
  return { rows, totalCount, result };
}

function decodeXml(value) {
  return String(value || "")
    .replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/g, "$1")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&")
    .trim();
}

function parseXmlPayload(text) {
  const totalCountMatch = text.match(/<total_count>([\s\S]*?)<\/total_count>/i);
  const totalCount = Number(decodeXml(totalCountMatch?.[1]) || 0);
  const rowMatches = [...text.matchAll(/<row>([\s\S]*?)<\/row>/gi)];

  const rows = rowMatches.map((match) => {
    const row = {};
    const tags = [...match[1].matchAll(/<([A-Z0-9_]+)>([\s\S]*?)<\/\1>/gi)];
    tags.forEach(([, key, value]) => {
      row[key] = decodeXml(value);
    });
    return row;
  });

  const code = text.match(/<CODE>([\s\S]*?)<\/CODE>/i)?.[1];
  const message = text.match(/<MSG>([\s\S]*?)<\/MSG>/i)?.[1];
  const result = code || message ? { CODE: decodeXml(code), MSG: decodeXml(message) } : null;
  return { rows, totalCount: totalCount || rows.length, result };
}

function parseApiPayload(text, contentType) {
  const trimmed = text.trim();
  if (contentType.includes("json") || trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return parseJsonPayload(trimmed);
  }
  return parseXmlPayload(trimmed);
}

async function fetchRows() {
  const url = buildApiUrl();
  const response = await fetch(url, {
    headers: {
      Accept: "application/json, application/xml, text/xml;q=0.9, */*;q=0.8"
    }
  });

  if (!response.ok) {
    throw new Error(`I0490 API 응답 오류: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  const parsed = parseApiPayload(text, response.headers.get("content-type") || "");

  if (!parsed.rows.length) {
    throw new Error(`I0490 API 응답에서 row 데이터를 찾지 못했습니다. RESULT=${JSON.stringify(parsed.result)}`);
  }

  return {
    ...parsed,
    sourceUrl: redactServiceKey(url)
  };
}

async function main() {
  const fetched = await fetchRows();
  const updatedAt = new Date().toISOString();
  const normalizedItems = fetched.rows.map((row, index) => normalizeRecallItem(row, index));

  await mkdir("data", { recursive: true });
  await writeFile("data/i0490-raw.json", `${JSON.stringify({
    source: SOURCE_NAME,
    sourceUrl: fetched.sourceUrl,
    updatedAt,
    totalCount: fetched.totalCount,
    count: fetched.rows.length,
    result: fetched.result,
    rows: fetched.rows
  }, null, 2)}\n`, "utf8");

  await writeFile("data/recalls.json", `${JSON.stringify({
    source: SOURCE_NAME,
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
