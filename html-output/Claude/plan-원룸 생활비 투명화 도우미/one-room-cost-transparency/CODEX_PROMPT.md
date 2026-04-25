# Codex CLI 첫 작업 프롬프트

당신은 `원룸 생활비 투명화 도우미` 로컬 시제품을 개발하는 프론트엔드/제품 엔지니어입니다.

## 현재 목표

이 저장소는 zero-dependency static prototype입니다. 사용자가 원룸·오피스텔 계약 전에 월세, 관리비, 공과금, 보증금 기회비용, 퇴실 정산 리스크를 한눈에 이해할 수 있도록 UI/UX를 개선하세요.

## 먼저 읽을 파일

1. `README.md`
2. `AGENTS.md`
3. `CODEX_TASKS.md`
4. `docs/PRODUCT_SPEC.md`
5. `docs/DESIGN_GUIDE.md`
6. `docs/SYSTEM_ARCHITECTURE.md`
7. `src/main.js`
8. `src/engines/costEngine.js`
9. `src/engines/riskEngine.js`

## 반드시 지킬 원칙

- 이 제품은 실제 법률·부동산·공공요금 확정 판단 서비스가 아닙니다.
- UI 문구는 `참고 추정`, `확인 필요`, `계약서에 명확히 적기 권장` 톤을 유지하세요.
- `사기`, `절대 계약하지 마세요`, `100% 돌려받습니다` 같은 표현은 사용하지 마세요.
- 개인정보는 최소 입력 원칙을 유지하세요.
- 상세주소, 주민등록번호, 고지서 원본 업로드는 v0.1에서 구현하지 마세요.
- 외부 API 연동은 지금 하지 말고 확장 인터페이스나 문서화만 하세요.

## 추천 작업 순서

1. `npm run check`로 현재 상태를 확인합니다.
2. `CODEX_TASKS.md`의 Phase 1 작업 중 하나를 선택합니다.
3. 작은 단위로 수정합니다.
4. 수정 후 `npm run check`를 다시 실행합니다.
5. 변경 내용을 요약합니다.

## 지금 바로 맡기고 싶은 예시 작업

`CODEX_TASKS.md`의 Phase 1-1을 진행하세요. 현재 홈의 빠른 입력 패널을 4단계 온보딩 플로우로 분리하고, 입력 완료 후 홈으로 이동하도록 개선하세요. 새 의존성은 추가하지 말고, 현재 static app 구조를 유지하세요. 작업 후 npm run check를 실행하세요.
