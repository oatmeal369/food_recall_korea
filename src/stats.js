import { RECALL_GRADES } from "./normalizer.js";

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "기타";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

export function toSortedEntries(counts, options = {}) {
  const { limit = null, direction = "desc", dateLike = false } = options;
  const entries = Object.entries(counts);
  entries.sort((a, b) => {
    if (dateLike) return direction === "asc" ? a[0].localeCompare(b[0]) : b[0].localeCompare(a[0]);
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0], "ko-KR");
  });
  return limit ? entries.slice(0, limit) : entries;
}

function topLabel(counts, fallback = "없음") {
  const top = toSortedEntries(counts, { limit: 1 })[0];
  return top ? top[0] : fallback;
}

function latestDate(items) {
  const dates = items
    .map((item) => item.registeredDate)
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
    .sort();
  return dates.at(-1) || "날짜 미상";
}

function withRatio(counts, total) {
  return Object.entries(counts).reduce((acc, [key, count]) => {
    acc[key] = {
      count,
      ratio: total ? Math.round((count / total) * 1000) / 10 : 0
    };
    return acc;
  }, {});
}

export function calculateStats(items) {
  const totalCount = items.length;
  const byProductTypeCategory = countBy(items, "productTypeCategory");
  const byDetailProductType = countBy(items, "detailProductType");
  const byRecallReasonOriginal = countBy(items, "recallReasonOriginal");
  const byRecallReasonMainCategory = countBy(items, "recallReasonMainCategory");
  const byRecallReasonSubCategory = countBy(items, "recallReasonSubCategory");
  const byRegisteredMonth = countBy(items, "registeredMonth");
  const byRegisteredYear = countBy(items, "registeredYear");
  const byRecallGrade = {
    "1등급": 0,
    "2등급": 0,
    "3등급": 0,
    "등급 미상": 0,
    ...countBy(items, "recallGrade")
  };
  const byRegionSido = countBy(items, "regionSido");
  const byCompanyName = countBy(items, "companyName");
  const byRecallMethodCategory = countBy(items, "recallMethodCategory");

  return {
    totalCount,
    latestDate: latestDate(items),
    topProductTypeCategory: topLabel(byProductTypeCategory),
    topRecallReasonMainCategory: topLabel(byRecallReasonMainCategory),
    gradeOneCount: byRecallGrade["1등급"] || 0,
    healthFunctionalFoodCount: byProductTypeCategory["건강기능식품"] || 0,
    byProductTypeCategory,
    byDetailProductType,
    byRecallReasonOriginal,
    byRecallReasonMainCategory,
    byRecallReasonSubCategory,
    byRegisteredMonth,
    byRegisteredYear,
    byRecallGrade,
    byRecallGradeWithRatio: withRatio(byRecallGrade, totalCount),
    byRegionSido,
    byCompanyName,
    byRecallMethodCategory,
    topDetailProductTypes: toSortedEntries(byDetailProductType, { limit: 10 }),
    topRecallReasonSubCategories: toSortedEntries(byRecallReasonSubCategory, { limit: 10 }),
    topCompanies: toSortedEntries(byCompanyName, { limit: 10 }),
    gradeOrder: RECALL_GRADES
  };
}
