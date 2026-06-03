import { loadRecallData } from "./dataLoader.js";
import { PRODUCT_TYPE_CATEGORIES, RECALL_GRADES, REGION_SIDOS, normalizeSearchText } from "./normalizer.js";
import { calculateStats, toSortedEntries } from "./stats.js";

const state = {
  allItems: [],
  filteredItems: [],
  filters: {},
  query: "",
  sort: "newest",
  visibleCount: 24,
  charts: {}
};

const chartColors = ["#2f6fed", "#168a7a", "#c94949", "#b97813", "#6f5cc2", "#2f7d4f", "#d35f8d", "#4e6f7f", "#8a6a2f", "#4f7cc9"];

const filters = [
  "productTypeCategory",
  "detailProductType",
  "recallReasonMainCategory",
  "recallReasonSubCategory",
  "recallGrade",
  "registeredYear",
  "registeredMonth",
  "regionSido",
  "companyName",
  "recallMethodCategory"
];

const elements = {
  dataStatus: document.querySelector("#dataStatus"),
  summaryGrid: document.querySelector("#summaryGrid"),
  searchInput: document.querySelector("#searchInput"),
  sortSelect: document.querySelector("#sortSelect"),
  filterGrid: document.querySelector("#filterGrid"),
  resetFilters: document.querySelector("#resetFilters"),
  resultCount: document.querySelector("#resultCount"),
  productGrid: document.querySelector("#productGrid"),
  loadMoreButton: document.querySelector("#loadMoreButton")
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatNumber(value) {
  return new Intl.NumberFormat("ko-KR").format(value || 0);
}

function createFilterOptions(items, key) {
  const values = new Set(items.map((item) => item[key]).filter(Boolean));
  let sorted = [...values].sort((a, b) => a.localeCompare(b, "ko-KR"));

  if (key === "productTypeCategory") {
    sorted = PRODUCT_TYPE_CATEGORIES.filter((value) => values.has(value));
  }
  if (key === "recallGrade") {
    sorted = RECALL_GRADES.filter((value) => values.has(value));
  }
  if (key === "regionSido") {
    sorted = REGION_SIDOS.filter((value) => values.has(value));
  }
  if (key === "registeredYear" || key === "registeredMonth") {
    sorted = sorted.sort((a, b) => b.localeCompare(a));
  }
  if (key === "companyName") {
    sorted = toSortedEntries(
      items.reduce((acc, item) => {
        acc[item.companyName] = (acc[item.companyName] || 0) + 1;
        return acc;
      }, {}),
      { limit: 80 }
    ).map(([label]) => label);
  }

  return ["", ...sorted];
}

function renderFilterOptions() {
  elements.filterGrid.querySelectorAll("select[data-filter]").forEach((select) => {
    const key = select.dataset.filter;
    const options = createFilterOptions(state.allItems, key);
    select.innerHTML = options.map((value) => {
      const label = value || "전체";
      return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;
    }).join("");
    select.value = state.filters[key] || "";
  });
}

function itemMatchesSearch(item) {
  if (!state.query) return true;
  const query = normalizeSearchText(state.query);
  return item.searchIndex.includes(query);
}

function itemMatchesFilters(item) {
  return filters.every((key) => {
    const selected = state.filters[key];
    return !selected || item[key] === selected;
  });
}

function compareByDate(a, b) {
  const left = a.registeredDate === "날짜 미상" ? "" : a.registeredDate;
  const right = b.registeredDate === "날짜 미상" ? "" : b.registeredDate;
  return right.localeCompare(left);
}

function sortItems(items) {
  const gradeRank = { "1등급": 1, "2등급": 2, "3등급": 3, "등급 미상": 4 };
  const sorted = [...items];
  sorted.sort((a, b) => {
    if (state.sort === "oldest") return compareByDate(b, a);
    if (state.sort === "grade") return (gradeRank[a.recallGrade] || 4) - (gradeRank[b.recallGrade] || 4) || compareByDate(a, b);
    if (state.sort === "productName") return a.productName.localeCompare(b.productName, "ko-KR") || compareByDate(a, b);
    if (state.sort === "companyName") return a.companyName.localeCompare(b.companyName, "ko-KR") || compareByDate(a, b);
    return compareByDate(a, b);
  });
  return sorted;
}

function applyFilters() {
  state.filteredItems = sortItems(state.allItems.filter((item) => itemMatchesSearch(item) && itemMatchesFilters(item)));
}

function renderSummary(stats) {
  const cards = [
    ["전체 회수 건수", `${formatNumber(stats.totalCount)}건`],
    ["최근 등록일", stats.latestDate],
    ["가장 많은 제품유형", stats.topProductTypeCategory],
    ["가장 많은 회수사유 대분류", stats.topRecallReasonMainCategory],
    ["1등급 회수 건수", `${formatNumber(stats.gradeOneCount)}건`],
    ["건강기능식품 회수 건수", `${formatNumber(stats.healthFunctionalFoodCount)}건`]
  ];

  elements.summaryGrid.innerHTML = cards.map(([label, value]) => `
    <article class="summary-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `).join("");
}

function chartDataFromEntries(entries) {
  return {
    labels: entries.map(([label]) => label),
    values: entries.map(([, value]) => value)
  };
}

function destroyChart(id) {
  if (state.charts[id]) {
    state.charts[id].destroy();
    delete state.charts[id];
  }
}

function renderChart(id, config) {
  destroyChart(id);
  const canvas = document.querySelector(`#${id}`);
  const labels = config.labels || [];
  const values = config.values || [];

  state.charts[id] = new Chart(canvas, {
    type: config.type,
    data: {
      labels,
      datasets: [{
        label: config.label,
        data: values,
        borderColor: config.borderColor || "#2f6fed",
        backgroundColor: config.backgroundColor || chartColors,
        borderWidth: config.type === "line" ? 2 : 1,
        tension: 0.28,
        fill: config.fill || false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: config.legend ?? ["doughnut", "pie"].includes(config.type),
          position: "bottom"
        },
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.label || context.dataset.label}: ${formatNumber(context.raw)}건`;
            }
          }
        }
      },
      scales: ["bar", "line"].includes(config.type) ? {
        x: {
          ticks: {
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0
          },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      } : undefined
    }
  });
}

function renderCharts(stats) {
  const monthly = chartDataFromEntries(toSortedEntries(stats.byRegisteredMonth, { direction: "asc", dateLike: true }).filter(([label]) => label !== "날짜 미상"));
  const yearly = chartDataFromEntries(toSortedEntries(stats.byRegisteredYear, { direction: "asc", dateLike: true }).filter(([label]) => label !== "날짜 미상"));
  const productType = chartDataFromEntries(toSortedEntries(stats.byProductTypeCategory));
  const detailType = chartDataFromEntries(stats.topDetailProductTypes);
  const reasonMain = chartDataFromEntries(toSortedEntries(stats.byRecallReasonMainCategory));
  const reasonSub = chartDataFromEntries(stats.topRecallReasonSubCategories);
  const grade = chartDataFromEntries(stats.gradeOrder.map((gradeLabel) => [gradeLabel, stats.byRecallGrade[gradeLabel] || 0]));
  const region = chartDataFromEntries(toSortedEntries(stats.byRegionSido));
  const company = chartDataFromEntries(stats.topCompanies);
  const method = chartDataFromEntries(toSortedEntries(stats.byRecallMethodCategory));

  renderChart("monthlyChart", { type: "line", label: "월별 회수 건수", ...monthly, backgroundColor: "rgba(47, 111, 237, 0.12)", fill: true });
  renderChart("yearlyChart", { type: "bar", label: "연도별 회수 건수", ...yearly, backgroundColor: "#168a7a" });
  renderChart("productTypeChart", { type: "doughnut", label: "제품유형별 건수", ...productType });
  renderChart("detailTypeChart", { type: "bar", label: "세부 제품유형 TOP 10", ...detailType, backgroundColor: "#2f6fed" });
  renderChart("reasonMainChart", { type: "bar", label: "회수사유 대분류별 건수", ...reasonMain, backgroundColor: "#c94949" });
  renderChart("reasonSubChart", { type: "bar", label: "회수사유 2차 분류 TOP 10", ...reasonSub, backgroundColor: "#b97813" });
  renderChart("gradeChart", { type: "doughnut", label: "회수등급별 비율", ...grade, backgroundColor: ["#c94949", "#b97813", "#2f7d4f", "#9aa6b2"] });
  renderChart("regionChart", { type: "bar", label: "업체 주소 기준 지역", ...region, backgroundColor: "#6f5cc2" });
  renderChart("companyChart", { type: "bar", label: "업체별 회수 등록 건수 TOP 10", ...company, backgroundColor: "#4e6f7f" });
  renderChart("methodChart", { type: "bar", label: "회수방법별 건수", ...method, backgroundColor: "#2f7d4f" });
}

function gradeClass(grade) {
  if (grade === "1등급") return "grade-1";
  if (grade === "2등급") return "grade-2";
  if (grade === "3등급") return "grade-3";
  return "";
}

function renderProductCard(item) {
  const image = item.imageUrls[0]
    ? `<img class="product-image" src="${escapeHtml(item.imageUrls[0])}" alt="${escapeHtml(item.productName)} 제품 이미지" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'), {className: 'product-image is-empty', textContent: '이미지 없음'}))" />`
    : `<div class="product-image is-empty">이미지 없음</div>`;

  return `
    <article class="product-card">
      ${image}
      <div class="product-body">
        <h3 class="product-title">${escapeHtml(item.productName)}</h3>
        <div class="chip-row">
          <span class="chip ${gradeClass(item.recallGrade)}">${escapeHtml(item.recallGrade)}</span>
          <span class="chip">${escapeHtml(item.productTypeCategory)}</span>
          <span class="chip">${escapeHtml(item.recallReasonMainCategory)}</span>
        </div>
        <p class="meta-line"><strong>업체명</strong> ${escapeHtml(item.companyName)}</p>
        <p class="meta-line"><strong>세부유형</strong> ${escapeHtml(item.detailProductType)}</p>
        <p class="meta-line reason-text"><strong>회수사유</strong> ${escapeHtml(item.recallReasonOriginal)}</p>
        <p class="meta-line"><strong>2차 분류</strong> ${escapeHtml(item.recallReasonSubCategory)}</p>
        <p class="meta-line"><strong>등록일</strong> ${escapeHtml(item.raw.CRET_DTM || item.registeredDate)}</p>
        <p class="meta-line"><strong>소비기한/유통기한</strong> ${escapeHtml(item.expirationDate)} · <strong>제조일자</strong> ${escapeHtml(item.manufactureDate)}</p>
        <p class="meta-line"><strong>지역</strong> ${escapeHtml(item.regionSido)} · <strong>회수방법</strong> ${escapeHtml(item.recallMethodOriginal || item.recallMethodCategory)}</p>
        ${item.barcode ? `<p class="meta-line"><strong>바코드</strong> ${escapeHtml(item.barcode)}</p>` : ""}
        ${item.raw.PRDLST_REPORT_NO ? `<p class="meta-line"><strong>품목보고번호</strong> ${escapeHtml(item.raw.PRDLST_REPORT_NO)}</p>` : ""}
        ${item.raw.LCNS_NO ? `<p class="meta-line"><strong>인허가번호</strong> ${escapeHtml(item.raw.LCNS_NO)}</p>` : ""}
        ${item.raw.TELNO ? `<p class="meta-line"><strong>전화번호</strong> ${escapeHtml(item.raw.TELNO)}</p>` : ""}
        ${item.address ? `<p class="meta-line"><strong>주소</strong> ${escapeHtml(item.address)}</p>` : ""}
      </div>
    </article>
  `;
}

function renderProducts() {
  const visible = state.filteredItems.slice(0, state.visibleCount);

  if (!visible.length) {
    elements.productGrid.innerHTML = `<div class="empty-state">표시할 회수 제품 데이터가 없습니다.</div>`;
    elements.loadMoreButton.hidden = true;
    return;
  }

  elements.productGrid.innerHTML = visible.map(renderProductCard).join("");
  elements.loadMoreButton.hidden = state.visibleCount >= state.filteredItems.length;
}

function renderResultCount() {
  elements.resultCount.textContent = `검색·필터 결과 ${formatNumber(state.filteredItems.length)}건 / 전체 ${formatNumber(state.allItems.length)}건`;
}

function render() {
  applyFilters();
  const stats = calculateStats(state.filteredItems);
  renderSummary(stats);
  renderCharts(stats);
  renderProducts();
  renderResultCount();
}

function bindEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    state.visibleCount = 24;
    render();
  });

  elements.sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });

  elements.filterGrid.addEventListener("change", (event) => {
    const select = event.target.closest("select[data-filter]");
    if (!select) return;
    state.filters[select.dataset.filter] = select.value;
    state.visibleCount = 24;
    render();
  });

  elements.resetFilters.addEventListener("click", () => {
    state.filters = {};
    state.query = "";
    state.sort = "newest";
    state.visibleCount = 24;
    elements.searchInput.value = "";
    elements.sortSelect.value = "newest";
    renderFilterOptions();
    render();
  });

  elements.loadMoreButton.addEventListener("click", () => {
    state.visibleCount += 24;
    renderProducts();
  });
}

async function init() {
  bindEvents();

  try {
    const { metadata, items } = await loadRecallData();
    state.allItems = items;
    renderFilterOptions();
    render();

    const updatedAt = metadata.updatedAt ? new Date(metadata.updatedAt).toLocaleString("ko-KR") : "아직 갱신 전";
    elements.dataStatus.textContent = `데이터 ${formatNumber(items.length)}건 · 갱신 ${updatedAt}`;
  } catch (error) {
    elements.dataStatus.textContent = "데이터 파일을 불러오지 못했습니다.";
    elements.productGrid.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
    renderSummary(calculateStats([]));
    renderCharts(calculateStats([]));
  }
}

init();
