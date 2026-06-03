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

async function fetchJson(url) {
  const response = await fetch(url, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`${url} response error: ${response.status}`);
  }

  return response.json();
}

async function loadStaticRecallData() {
  const payload = await fetchJson(`./data/recalls.json?ts=${Date.now()}`);
  return {
    metadata: payload,
    items: normalizePayload(payload)
  };
}

async function loadVercelApiRecallData() {
  const payload = await fetchJson(`/api/recalls?ts=${Date.now()}`);
  return {
    metadata: {
      ...payload,
      loadedFrom: "api"
    },
    items: normalizePayload(payload)
  };
}

export async function loadRecallData() {
  const staticData = await loadStaticRecallData();
  if (staticData.items.length > 0) return staticData;

  try {
    const apiData = await loadVercelApiRecallData();
    if (apiData.items.length > 0) return apiData;
  } catch (error) {
    console.warn("Vercel API fallback failed.", error);
  }

  return staticData;
}
