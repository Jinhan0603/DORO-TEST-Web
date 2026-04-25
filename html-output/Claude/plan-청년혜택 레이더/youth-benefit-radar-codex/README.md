# 청년혜택 레이더 — Codex CLI용 로컬 시제품

**청년혜택 레이더**는 사용자의 나이·소득구간·거주지·직장상태·주거상태를 바탕으로 청년정책·지원금·저축상품·주거지원을 목업 DB에서 필터링하고, 마감일과 제출서류를 관리하는 UI/UX 중심 시제품입니다.

이 프로젝트는 Codex CLI가 바로 읽고 작업할 수 있도록 구성되어 있습니다.

## 핵심 가치

> “정책이 없는 문제가 아니라, 내 조건에 맞는지 해석하기 어렵고 마감·서류를 놓치는 문제를 해결한다.”

## 현재 구현된 기능

- 조건 입력 프로필 패널
- 신청 가능성 기반 혜택 매칭
- 매칭 사유/추가 확인 사유 표시
- 정책 상세 조건 해석
- 마감 D-day 타임라인
- 제출서류 체크리스트
- 혜택 분야별 레이더 바
- 3,900원 프리미엄 가치 검증 카드
- localStorage 기반 조건·서류 체크 저장

## 실행 방법

이 프로젝트는 **zero-dependency static prototype**입니다. `npm install` 없이 실행할 수 있습니다.

```bash
npm run dev
```

브라우저에서 접속합니다.

```bash
http://localhost:5173
```

또는 Python으로 직접 실행합니다.

```bash
python3 -m http.server 5173
```

## 검증

```bash
npm run lint
npm run build
```

- `lint`: JS 문법 체크
- `build`: 정적 파일을 `dist/`로 복사

## Codex CLI로 작업 시작

Codex CLI가 없다면 먼저 설치합니다. OpenAI Help Center의 Codex CLI 시작 안내는 전역 npm 설치 명령으로 `npm install -g @openai/codex`를 제시하고, 최근 안내에서는 CLI 실행 후 ChatGPT 계정으로 로그인하는 흐름도 지원한다고 설명합니다.

```bash
npm install -g @openai/codex
```

프로젝트 루트에서 Codex를 실행합니다.

```bash
codex
```

로그인이 필요하면 다음 명령을 사용합니다.

```bash
codex --login
```

Codex가 열리면 `CODEX_PROMPT.md` 내용을 붙여넣습니다.

프롬프트를 터미널에 출력하려면:

```bash
npm run codex:prompt
```

## 폴더 구조

```text
youth-benefit-radar-codex/
├─ AGENTS.md
├─ CODEX_PROMPT.md
├─ CODEX_TASKS.md
├─ docs/
├─ scripts/
├─ src/
│  ├─ data/policies.js
│  ├─ features/matching.js
│  ├─ features/deadlines.js
│  ├─ features/documents.js
│  ├─ lib/format.js
│  ├─ lib/storage.js
│  ├─ main.js
│  └─ styles.css
└─ package.json
```

## 중요한 제품 원칙

- 이 서비스는 공식 자격 판정 서비스가 아닙니다.
- UI에서는 “신청 가능성”, “추가 확인 필요”, “현재 조건상 어려움”으로 표현합니다.
- 실제 신청 가능 여부와 지원금 지급 여부는 담당 기관 심사에 따라 달라질 수 있습니다.
- 초기 시제품에서는 주민등록번호, 상세 주소, 실제 증빙서류 파일을 수집하지 않습니다.

## 다음 개발 추천

1. 온보딩 3단계 화면 분리
2. 마감 캘린더 월간 그리드 개선
3. 신청 진행 상태 트래커 추가
4. 정책 변경 요약 뱃지 추가
5. 온통청년 API 연동을 위한 repository interface 추가
