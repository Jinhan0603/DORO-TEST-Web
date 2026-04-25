# 원룸 생활비 투명화 도우미 — Codex CLI 작업 패키지

원룸·오피스텔·다가구 계약 전, **월세 + 관리비 + 공과금 + 보증금 기회비용 + 퇴실 정산 리스크**를 한 화면에서 이해하도록 돕는 로컬 UI/UX 시제품입니다.

이 저장소는 Codex CLI가 바로 읽고 수정할 수 있도록 제품 문서, 디자인 가이드, 시스템 구조도, 로컬 실행 코드, 테스트 스크립트를 함께 포함합니다.

## 핵심 포지셔닝

> 월세 광고 가격을 실제 생활비 총액으로 번역해주는 계약 전 주거비 해석기.

이 시제품은 정확한 공공요금 산정기가 아닙니다. 사용자가 계약 전에 다음 질문을 확인하도록 돕는 UI 검증용 도구입니다.

- 이 방의 실제 월 주거비는 얼마인가?
- 관리비에 무엇이 포함되고 무엇이 빠졌는가?
- 여름·겨울 공과금이 얼마나 흔들릴 수 있는가?
- 계약 전에 중개사·임대인에게 무엇을 물어봐야 하는가?
- 퇴실 때 보증금에서 어떤 항목이 차감될 수 있는가?

## 로컬 실행

이 프로젝트는 zero-dependency static prototype입니다. `npm install` 없이 실행할 수 있습니다.

```bash
cd one-room-cost-transparency-codex
npm run dev
```

브라우저에서 접속합니다.

```text
http://localhost:5173
```

## 검증

```bash
npm run lint
npm run test
npm run build
```

한 번에 실행하려면:

```bash
npm run check
```

## Codex CLI 사용

프로젝트 루트에서 Codex를 실행합니다.

```bash
codex
```

Codex가 열리면 아래 명령으로 첫 프롬프트를 출력해 붙여넣습니다.

```bash
npm run codex:prompt
```

## 주요 화면

- 홈: 진짜 월 주거비, 계절별 예상, 비용 투명도, 위험 신호
- 해부도: 월세·관리비·공과금·보증금 기회비용 비중
- 비교: 방 후보 3개 실제 월비용 비교
- 체크: 계약 전 질문 체크리스트와 복사용 질문
- 정산: 퇴실 정산 예상과 최근 고지서 기록

## 프로젝트 구조

```text
one-room-cost-transparency-codex/
├─ index.html
├─ src/
│  ├─ main.js
│  ├─ styles.css
│  ├─ data/mockRooms.js
│  └─ engines/
│     ├─ costEngine.js
│     ├─ riskEngine.js
│     ├─ checklistEngine.js
│     └─ settlementEngine.js
├─ scripts/
│  ├─ dev-server.mjs
│  ├─ build.mjs
│  ├─ lint.mjs
│  ├─ test.mjs
│  └─ print-codex-prompt.mjs
├─ docs/
│  ├─ PRODUCT_SPEC.md
│  ├─ DESIGN_GUIDE.md
│  ├─ SYSTEM_ARCHITECTURE.md
│  ├─ LOCAL_PROTOTYPE_SCOPE.md
│  ├─ PRIVACY_AND_TRUST.md
│  └─ SOURCE_NOTES.md
├─ AGENTS.md
├─ CODEX_PROMPT.md
└─ CODEX_TASKS.md
```

## 개발 원칙

1. 사용자를 겁주는 법적 단정 표현을 피합니다. `사기`, `절대 계약 금지`, `100% 반환` 같은 문구를 사용하지 않습니다.
2. 모든 계산은 `참고 추정`으로 표시합니다.
3. 개인정보는 최소 입력으로 유지합니다. 상세주소, 주민번호, 실제 고지서 업로드는 v0.1에서 제외합니다.
4. UI는 모바일 우선으로 설계하되, 방 비교표는 데스크톱에서도 보기 좋게 만듭니다.
5. Codex가 기능을 추가할 때는 계산 엔진과 UI 렌더링을 분리합니다.

## 다음 개발 후보

- 온보딩 4단계 화면 분리
- 관리비 포함 항목 편집 UI 추가
- 방 후보 추가/삭제 기능
- PDF 비교 리포트 목업
- 월별 고지서 수동 입력 화면
- OCR 업로드 목업 화면
- K-apt/한전 공식 계산기 확장 인터페이스 설계
