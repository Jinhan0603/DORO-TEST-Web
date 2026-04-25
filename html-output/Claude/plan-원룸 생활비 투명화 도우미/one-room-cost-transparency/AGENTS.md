# AGENTS.md

Codex CLI 또는 다른 코딩 에이전트가 이 저장소에서 작업할 때 지켜야 할 지침입니다.

## 제품 원칙

- 이 제품은 부동산 중개 서비스가 아니라 **계약 전 주거비 해석 도구**입니다.
- 핵심 가치는 `월세 광고 가격`과 `실제 월 부담액`의 차이를 시각적으로 보여주는 것입니다.
- 사용자를 겁주거나 임대인/중개사를 단정적으로 비난하지 않습니다.
- 정책/법률/공공요금 확정 판단처럼 보이는 표현을 피합니다.
- 모든 계산 결과에는 `참고 추정` 맥락을 유지합니다.

## UX 문구 금지어

다음 표현은 쓰지 마세요.

- 사기입니다
- 절대 계약하지 마세요
- 100% 돌려받습니다
- 임대인이 잘못했습니다
- 정확한 공과금입니다
- 확정 반환액

권장 표현:

- 추가 확인이 필요해요
- 계약서에 명확히 적는 것이 안전해요
- 참고 추정입니다
- 공식 고지서와 계약서 기준으로 다시 확인하세요

## 기술 원칙

- 현재 시제품은 zero-dependency static app입니다.
- 새 의존성을 추가하기 전 사용자의 명시적 요청 또는 충분한 이유가 필요합니다.
- 계산 로직은 `src/engines/`에 두고, UI 렌더링은 `src/main.js`에서 관리합니다.
- 로컬 상태는 `localStorage`를 사용합니다.
- 실제 API 연동은 v0.1에서 구현하지 않습니다. 필요한 경우 repository interface만 설계합니다.

## 검증 명령

작업 후 아래 명령을 실행하세요.

```bash
npm run lint
npm run test
npm run build
```

또는:

```bash
npm run check
```

## 주요 파일

- `docs/PRODUCT_SPEC.md`: 제품 정의와 MVP 기능
- `docs/DESIGN_GUIDE.md`: UI/UX 스타일 가이드
- `docs/SYSTEM_ARCHITECTURE.md`: 시스템 구조와 데이터 모델
- `src/engines/costEngine.js`: 주거비 계산 엔진
- `src/engines/riskEngine.js`: 위험 신호 및 투명도 점수
- `src/engines/checklistEngine.js`: 계약 전 질문 체크리스트
- `src/engines/settlementEngine.js`: 퇴실 정산 계산
- `src/data/mockRooms.js`: 목업 방 후보 데이터

## 우선 개발 과제

1. 온보딩을 별도 플로우로 분리
2. 방 후보 추가/삭제/복제 기능
3. 관리비 포함 항목 편집 UI
4. 월별 고지서 기록 CRUD
5. 계약 전 질문 PDF/Markdown 내보내기
6. 퇴실 정산 세부 입력 개선
