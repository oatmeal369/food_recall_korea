# 식품 회수 통계 대시보드

식품안전나라 `I0490` 회수·판매중지 데이터를 정규화해서 통계, 차트, 검색, 필터, 제품 카드로 보여주는 정적 사이트입니다.

## 구성

- `index.html`: 대시보드 화면
- `styles.css`: 화면 스타일
- `src/normalizer.js`: row 정규화 함수와 분류 기준
- `src/stats.js`: 통계 집계 함수
- `src/dataLoader.js`: 정적 데이터 파일 로딩
- `src/app.js`: 필터, 정렬, 차트, 카드 렌더링
- `scripts/fetch-i0490.mjs`: I0490 API 호출 후 `data/recalls.json` 갱신
- `.github/workflows/update-i0490-data.yml`: 6시간마다 데이터 자동 갱신

## 로컬 실행

```powershell
npm run update:data
npm start
```

브라우저에서 `http://localhost:5173`을 열면 됩니다.

실제 서비스키를 사용할 때는 코드에 직접 넣지 말고 환경 변수로 전달합니다.

```powershell
$env:FOODSAFETY_SERVICE_KEY="발급받은_키"
npm run update:data
```

## GitHub 자동 반영

1. 이 파일들을 GitHub 저장소에 올립니다.
2. GitHub Pages를 `main` 브랜치의 root 경로로 설정합니다.
3. 실제 API 키를 쓰려면 저장소 `Settings > Secrets and variables > Actions`에 `FOODSAFETY_SERVICE_KEY`를 추가합니다.
4. `.github/workflows/update-i0490-data.yml`이 6시간마다 API를 호출하고 `data/recalls.json`을 커밋합니다.

키가 없으면 `sample` 키로 실행됩니다. 개인 서비스키는 커밋하지 마세요.

## Vercel 배포

Vercel에서는 `data/recalls.json`이 비어 있으면 `/api/recalls` 서버리스 함수가 자동으로 식품안전나라 API를 호출합니다.

실제 운영 데이터 전체를 받으려면 Vercel 프로젝트 `Settings > Environment Variables`에 아래 값을 추가합니다.

- `FOODSAFETY_SERVICE_KEY`: 식품안전나라에서 발급받은 서비스키

서비스키를 넣지 않으면 `sample` 키로 동작하며, 샘플 row 일부만 표시될 수 있습니다.

## 집계 기준

- 지역 통계는 실제 위해 발생 지역이 아니라 업체 주소 기준입니다.
- 업체 통계는 row 기준 회수 등록 건수입니다.
- 동일 업체의 반복 회수 여부를 단정하지 않고, 화면에서는 회수 등록 건수가 많은 업체로 표현합니다.
- 검색은 제품명, 업체명, 회수사유, 제품유형, 세부유형, 주소, 회수등급, 소비기한/유통기한, 제조일자, 바코드를 통합 검색합니다.
