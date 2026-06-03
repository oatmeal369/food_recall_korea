export const I0490_API_CODE = "I0490";
export const I0490_SOURCE_NAME = "식품안전나라 I0490";

export function buildFoodsafetyApiUrl(options = {}) {
  const {
    explicitUrl = "",
    serviceKey = "sample",
    format = "json",
    start = "1",
    end = "1000"
  } = options;

  if (explicitUrl) return explicitUrl;

  return `http://openapi.foodsafetykorea.go.kr/api/${encodeURIComponent(serviceKey || "sample")}/${I0490_API_CODE}/${format || "json"}/${start || "1"}/${end || "1000"}`;
}

export function redactServiceKey(url) {
  return url.replace(/\/api\/([^/]+)\//, (_match, key) => `/api/${key === "sample" ? "sample" : "<SERVICE_KEY>"}/`);
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function parseJsonPayload(text) {
  const payload = JSON.parse(text);
  const root = payload[I0490_API_CODE] || payload.I0490 || payload;
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
  const rowMatches = [...text.matchAll(/<row(?:\s[^>]*)?>([\s\S]*?)<\/row>/gi)];

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

export function parseFoodsafetyPayload(text, contentType = "") {
  const trimmed = text.trim();
  if (contentType.includes("json") || trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return parseJsonPayload(trimmed);
  }
  return parseXmlPayload(trimmed);
}

export async function fetchI0490Rows(options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  if (!fetchImpl) {
    throw new Error("fetch를 사용할 수 없습니다.");
  }

  const url = buildFoodsafetyApiUrl(options);
  const response = await fetchImpl(url, {
    headers: {
      Accept: "application/json, application/xml, text/xml;q=0.9, */*;q=0.8"
    }
  });

  if (!response.ok) {
    throw new Error(`I0490 API 응답 오류: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  const parsed = parseFoodsafetyPayload(text, response.headers.get("content-type") || "");

  if (!parsed.rows.length) {
    throw new Error(`I0490 API 응답에서 row 데이터를 찾지 못했습니다. RESULT=${JSON.stringify(parsed.result)}`);
  }

  return {
    ...parsed,
    sourceUrl: redactServiceKey(url)
  };
}
