export const PRODUCT_TYPE_CATEGORIES = [
  "가공식품",
  "건강기능식품",
  "농산물",
  "축산물",
  "수산물",
  "임산물",
  "기구용기포장",
  "식품첨가물",
  "기타"
];

export const RECALL_REASON_MAIN_CATEGORIES = [
  "미생물 기준 부적합",
  "이물 혼입",
  "식품첨가물 기준 부적합",
  "잔류농약 기준 초과",
  "중금속·오염물질 기준 초과",
  "동물용의약품 기준 초과",
  "표시 위반",
  "무신고·무등록·불법 수입",
  "건강기능식품 성분·함량 부적합",
  "기준·규격 일반 부적합",
  "품질·성상 부적합",
  "기타"
];

export const RECALL_GRADES = ["1등급", "2등급", "3등급", "등급 미상"];

export const REGION_SIDOS = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
  "지역 미상"
];

export const RECALL_METHOD_CATEGORIES = [
  "거래처·판매처 회수",
  "택배·반품 회수",
  "방문 회수",
  "소비자 안내·소비자 회수",
  "온라인·플랫폼 공지",
  "유선·메일 통보",
  "자체 회수",
  "회수방법 미상",
  "기타"
];

const reasonMainRules = [
  {
    category: "미생물 기준 부적합",
    keywords: ["세균수", "세균발육", "대장균", "대장균군", "살모넬라", "바실루스", "바실루스세레우스", "황색포도상구균", "리스테리아", "장출혈성", "클로스트리디움", "곰팡이", "진균"]
  },
  {
    category: "이물 혼입",
    keywords: ["이물", "금속성이물", "금속성 이물", "유리조각", "플라스틱", "벌레", "곤충", "머리카락", "비닐", "고무", "나사", "철사"]
  },
  {
    category: "식품첨가물 기준 부적합",
    keywords: ["보존료", "소브산", "안식향산", "파라옥시안식향산", "타르색소", "착색료", "감미료", "아황산", "이산화황", "식품첨가물"]
  },
  {
    category: "잔류농약 기준 초과",
    keywords: ["잔류농약", "농약", "프로피코나졸", "클로르피리포스", "카벤다짐", "이미다클로프리드", "아세타미프리드", "플루벤디아마이드"]
  },
  {
    category: "중금속·오염물질 기준 초과",
    keywords: ["중금속", "카드뮴", "납", "비소", "총수은", "메틸수은", "벤조피렌", "곰팡이독소", "아플라톡신", "오크라톡신", "다이옥신", "방사능"]
  },
  {
    category: "동물용의약품 기준 초과",
    keywords: ["동물용의약품", "항생제", "엔로플록사신", "옥시테트라사이클린", "말라카이트그린", "니트로푸란"]
  },
  {
    category: "표시 위반",
    keywords: ["표시", "미표시", "표시사항", "알레르기", "알레르기 유발", "원료성분", "소비기한", "유통기한", "제조일자", "품목보고번호", "한글표시", "영양성분", "내용량"]
  },
  {
    category: "무신고·무등록·불법 수입",
    keywords: ["무신고", "미신고", "무등록", "무허가", "수입신고하지 아니한", "수입신고", "불법 수입", "소분판매", "소분 판매", "영업등록", "영업신고"]
  },
  {
    category: "건강기능식품 성분·함량 부적합",
    keywords: ["건강기능식품", "기능성분", "함량 부족", "함량 초과", "프로바이오틱스 수", "비타민", "EPA", "DHA", "판토텐산", "실리마린", "밀크씨슬", "오메가", "아연", "마그네슘", "칼슘"]
  },
  {
    category: "품질·성상 부적합",
    keywords: ["산가", "과산화물가", "수분", "회분", "산도", "성상", "변질", "부패", "산패", "이미", "이취"]
  },
  {
    category: "기준·규격 일반 부적합",
    keywords: ["기준 규격 부적합", "기준규격 부적합", "규격 부적합", "기준 초과", "부적합"]
  }
];

const regionRules = [
  ["서울", ["서울특별시", "서울"]],
  ["부산", ["부산광역시", "부산"]],
  ["대구", ["대구광역시", "대구"]],
  ["인천", ["인천광역시", "인천"]],
  ["광주", ["광주광역시", "광주"]],
  ["대전", ["대전광역시", "대전"]],
  ["울산", ["울산광역시", "울산"]],
  ["세종", ["세종특별자치시", "세종"]],
  ["경기", ["경기도", "경기"]],
  ["강원", ["강원특별자치도", "강원도", "강원"]],
  ["충북", ["충청북도", "충북"]],
  ["충남", ["충청남도", "충남"]],
  ["전북", ["전북특별자치도", "전라북도", "전북"]],
  ["전남", ["전라남도", "전남"]],
  ["경북", ["경상북도", "경북"]],
  ["경남", ["경상남도", "경남"]],
  ["제주", ["제주특별자치도", "제주"]]
];

const recallMethodRules = [
  { category: "소비자 안내·소비자 회수", keywords: ["소비자", "고객 안내문", "SMS", "앱푸시"] },
  { category: "온라인·플랫폼 공지", keywords: ["플랫폼", "팝업", "공지"] },
  { category: "방문 회수", keywords: ["방문", "직접회수", "직접 회수"] },
  { category: "택배·반품 회수", keywords: ["택배", "반품", "영업소"] },
  { category: "거래처·판매처 회수", keywords: ["거래처", "판매처", "거래선", "유통재고"] },
  { category: "유선·메일 통보", keywords: ["메일", "이메일", "유선", "전화"] },
  { category: "자체 회수", keywords: ["자체 규정", "자체 회수"] }
];

export function cleanText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  const text = String(value).replace(/\s+/g, " ").trim();
  return text || fallback;
}

function compactText(value) {
  return cleanText(value).toLocaleLowerCase("ko-KR").replace(/\s+/g, "");
}

function includesKeyword(value, keyword) {
  const source = cleanText(value).toLocaleLowerCase("ko-KR");
  const compactSource = compactText(source);
  const needle = cleanText(keyword).toLocaleLowerCase("ko-KR");
  return source.includes(needle) || compactSource.includes(needle.replace(/\s+/g, ""));
}

function includesAny(value, keywords) {
  return keywords.some((keyword) => includesKeyword(value, keyword));
}

export function normalizeProductTypeCategory(value) {
  const text = cleanText(value);
  return PRODUCT_TYPE_CATEGORIES.includes(text) ? text : "기타";
}

export function normalizeDetailProductType(value) {
  return cleanText(value, "기타");
}

export function normalizeRecallReasonMainCategory(value) {
  const reason = cleanText(value);
  if (!reason) return "기타";
  const matched = reasonMainRules.find((rule) => includesAny(reason, rule.keywords));
  return matched ? matched.category : "기타";
}

export function normalizeRecallReasonSubCategory(value, mainCategory = normalizeRecallReasonMainCategory(value)) {
  const reason = cleanText(value);

  if (mainCategory === "미생물 기준 부적합") {
    if (includesKeyword(reason, "세균수")) return "세균수 부적합";
    if (includesKeyword(reason, "세균발육")) return "세균발육 부적합";
    if (includesKeyword(reason, "대장균군")) return "대장균군 부적합";
    if (includesKeyword(reason, "대장균")) return "대장균 부적합";
    if (includesKeyword(reason, "살모넬라")) return "살모넬라 부적합";
    if (includesAny(reason, ["바실루스세레우스", "바실루스 세레우스"])) return "바실루스세레우스 부적합";
    if (includesKeyword(reason, "황색포도상구균")) return "황색포도상구균 부적합";
    if (includesKeyword(reason, "리스테리아")) return "리스테리아 부적합";
    return "기타 미생물 부적합";
  }

  if (mainCategory === "이물 혼입") {
    if (includesAny(reason, ["금속성이물", "금속성 이물", "나사", "철사"])) return "금속성이물";
    if (includesKeyword(reason, "유리조각")) return "유리조각";
    if (includesKeyword(reason, "플라스틱")) return "플라스틱 이물";
    if (includesAny(reason, ["벌레", "곤충"])) return "벌레·곤충 이물";
    if (includesKeyword(reason, "머리카락")) return "머리카락 이물";
    if (includesAny(reason, ["비닐", "고무"])) return "비닐·고무 이물";
    return "기타 이물";
  }

  if (mainCategory === "식품첨가물 기준 부적합") {
    if (includesKeyword(reason, "보존료")) return "보존료 부적합";
    if (includesKeyword(reason, "소브산")) return "소브산 부적합";
    if (includesKeyword(reason, "안식향산")) return "안식향산 부적합";
    if (includesKeyword(reason, "파라옥시안식향산")) return "파라옥시안식향산 부적합";
    if (includesAny(reason, ["타르색소", "착색료"])) return "타르색소 부적합";
    if (includesAny(reason, ["아황산", "이산화황"])) return "아황산류 부적합";
    return "기타 식품첨가물 부적합";
  }

  if (mainCategory === "잔류농약 기준 초과") {
    if (includesKeyword(reason, "프로피코나졸")) return "프로피코나졸 기준 초과";
    if (includesKeyword(reason, "클로르피리포스")) return "클로르피리포스 기준 초과";
    if (includesKeyword(reason, "카벤다짐")) return "카벤다짐 기준 초과";
    if (includesKeyword(reason, "이미다클로프리드")) return "이미다클로프리드 기준 초과";
    return "기타 잔류농약 기준 초과";
  }

  if (mainCategory === "중금속·오염물질 기준 초과") {
    if (includesKeyword(reason, "카드뮴")) return "카드뮴 기준 초과";
    if (includesKeyword(reason, "납")) return "납 기준 초과";
    if (includesKeyword(reason, "비소")) return "비소 기준 초과";
    if (includesAny(reason, ["총수은", "메틸수은", "수은"])) return "수은 기준 초과";
    if (includesKeyword(reason, "벤조피렌")) return "벤조피렌 기준 초과";
    if (includesAny(reason, ["곰팡이독소", "아플라톡신", "오크라톡신"])) return "곰팡이독소 기준 초과";
    if (includesKeyword(reason, "방사능")) return "방사능 기준 초과";
    return "기타 오염물질 기준 초과";
  }

  if (mainCategory === "동물용의약품 기준 초과") {
    if (includesKeyword(reason, "동물용의약품")) return "동물용의약품 기준 초과";
    if (includesAny(reason, ["항생제", "엔로플록사신", "옥시테트라사이클린"])) return "항생제 기준 초과";
    return "기타 동물용의약품 부적합";
  }

  if (mainCategory === "표시 위반") {
    if (includesAny(reason, ["알레르기", "알레르기 유발"])) return "알레르기 유발물질 미표시";
    if (includesAny(reason, ["소비기한", "유통기한", "제조일자"])) return "소비기한·유통기한 표시 위반";
    if (includesKeyword(reason, "한글표시")) return "한글표시사항 위반";
    if (includesAny(reason, ["원재료명", "원료성분"])) return "원재료명 표시 위반";
    if (includesKeyword(reason, "영양성분")) return "영양성분 표시 위반";
    if (includesKeyword(reason, "내용량")) return "내용량 표시 위반";
    return "기타 표시 위반";
  }

  if (mainCategory === "무신고·무등록·불법 수입") {
    if (includesAny(reason, ["무신고 소분판매", "소분판매", "소분 판매"])) return "무신고 소분판매";
    if (includesAny(reason, ["무신고", "미신고"])) return "무신고 제조·판매";
    if (includesAny(reason, ["무등록", "영업등록", "영업신고"])) return "무등록 영업";
    if (includesAny(reason, ["수입신고하지 아니한", "수입신고"])) return "수입신고 미이행";
    return "기타 무신고·무등록";
  }

  if (mainCategory === "건강기능식품 성분·함량 부적합") {
    if (includesKeyword(reason, "함량 부족")) return "기능성분 함량 부족";
    if (includesKeyword(reason, "함량 초과")) return "기능성분 함량 초과";
    if (includesKeyword(reason, "프로바이오틱스 수")) return "프로바이오틱스 수 부적합";
    if (includesKeyword(reason, "비타민")) return "비타민 함량 부적합";
    if (includesAny(reason, ["EPA", "DHA"])) return "EPA·DHA 함량 부적합";
    if (includesAny(reason, ["실리마린", "밀크씨슬"])) return "실리마린 함량 부적합";
    return "기타 건강기능식품 부적합";
  }

  if (mainCategory === "품질·성상 부적합") {
    if (includesKeyword(reason, "산가")) return "산가 부적합";
    if (includesKeyword(reason, "과산화물가")) return "과산화물가 부적합";
    if (includesKeyword(reason, "수분")) return "수분 부적합";
    if (includesKeyword(reason, "성상")) return "성상 부적합";
    if (includesAny(reason, ["변질", "부패", "산패", "이미", "이취"])) return "변질·부패";
    return "기타 품질 부적합";
  }

  return "기타";
}

export function normalizeRecallGrade(value) {
  const grade = cleanText(value);
  return RECALL_GRADES.includes(grade) && grade !== "등급 미상" ? grade : "등급 미상";
}

export function normalizeRegisteredDate(value) {
  const text = cleanText(value);
  const date = text.slice(0, 10);
  const isValid = /^\d{4}-\d{2}-\d{2}$/.test(date);
  if (!isValid) {
    return {
      registeredDate: "날짜 미상",
      registeredYear: "날짜 미상",
      registeredMonth: "날짜 미상",
      registeredQuarter: "날짜 미상"
    };
  }

  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const quarter = Math.floor((Number(month) - 1) / 3) + 1;

  return {
    registeredDate: date,
    registeredYear: year,
    registeredMonth: date.slice(0, 7),
    registeredQuarter: `${year}-Q${quarter}`
  };
}

export function normalizeRegionSido(value) {
  const address = cleanText(value);
  if (!address) return "지역 미상";
  const matched = regionRules.find(([, keywords]) => includesAny(address, keywords));
  return matched ? matched[0] : "지역 미상";
}

export function normalizeRecallMethodCategories(value) {
  const method = cleanText(value);
  if (!method) return ["회수방법 미상"];
  const matches = recallMethodRules.filter((rule) => includesAny(method, rule.keywords)).map((rule) => rule.category);
  return matches.length ? matches : ["기타"];
}

export function normalizeRecallMethodCategory(value) {
  return normalizeRecallMethodCategories(value)[0];
}

function splitImageUrls(value) {
  return cleanText(value)
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
}

export function normalizeSearchText(value) {
  return cleanText(value).toLocaleLowerCase("ko-KR").replace(/\s+/g, "");
}

export function buildSearchIndex(item) {
  const raw = item.raw || {};
  return [
    item.productName,
    item.companyName,
    item.recallReasonOriginal,
    raw.PRDLST_TYPE,
    raw.PRDLST_CD_NM,
    raw.ADDR,
    raw.RTRVL_GRDCD_NM,
    raw.DISTBTMLMT,
    raw.MNFDT,
    raw.BRCDNO
  ].map(normalizeSearchText).join(" ");
}

export function normalizeRecallItem(row = {}, index = 0) {
  const recallReasonOriginal = cleanText(row.RTRVLPRVNS, "회수사유 미상");
  const recallReasonMainCategory = normalizeRecallReasonMainCategory(recallReasonOriginal);
  const recallMethodOriginal = cleanText(row.RTRVLPLANDOC_RTRVLMTHD);
  const dateParts = normalizeRegisteredDate(row.CRET_DTM);

  const item = {
    id: cleanText(row.RTRVLDSUSE_SEQ || row.RTRVLDSUSE_SEQ_NO || row.RTRVLDSUSESEQ || row.id, `row-${index + 1}`),
    productName: cleanText(row.PRDTNM, "제품명 미상"),
    companyName: cleanText(row.BSSHNM, "업체명 미상"),
    productTypeCategory: normalizeProductTypeCategory(row.PRDLST_TYPE),
    detailProductType: normalizeDetailProductType(row.PRDLST_CD_NM),
    recallReasonOriginal,
    recallReasonMainCategory,
    recallReasonSubCategory: normalizeRecallReasonSubCategory(recallReasonOriginal, recallReasonMainCategory),
    recallGrade: normalizeRecallGrade(row.RTRVL_GRDCD_NM),
    ...dateParts,
    regionSido: normalizeRegionSido(row.ADDR),
    recallMethodOriginal,
    recallMethodCategory: normalizeRecallMethodCategory(recallMethodOriginal),
    recallMethodCategories: normalizeRecallMethodCategories(recallMethodOriginal),
    expirationDate: cleanText(row.DISTBTMLMT, "정보 없음"),
    manufactureDate: cleanText(row.MNFDT, "정보 없음"),
    barcode: cleanText(row.BRCDNO),
    address: cleanText(row.ADDR),
    imageUrls: splitImageUrls(row.IMG_FILE_PATH),
    raw: row
  };

  return {
    ...item,
    searchIndex: buildSearchIndex(item)
  };
}
