import { buildSearchIndex, normalizeRecallItem } from "./normalizer.js";

function normalizePayload(payload) {
  const rows = Array.isArray(payload?.rows)
    ? payload.rows
    : Array.isArray(payload?.row)
      ? payload.row
      : Array.isArray(payload?.items)
        ? payload.items
        : [];

  if (!rows.length) return [];

  return rows.map((row, index) => {
    if (row.productName && row.recallReasonMainCategory && row.raw) {
      return {
        ...row,
        searchIndex: row.searchIndex || buildSearchIndex(row)
      };
    }
    return normalizeRecallItem(row.raw || row, index);
  });
}

export async function loadRecallData() {
  const response = await fetch(`./data/recalls.json?ts=${Date.now()}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`data/recalls.json 응답 오류: ${response.status}`);
  }

  const payload = await response.json();
  return {
    metadata: payload,
    items: normalizePayload(payload)
  };
}
