# Codex CLI 시작 프롬프트

아래 내용을 Codex CLI 첫 입력으로 붙여넣으세요.

```text
이 저장소는 “청년혜택 레이더” 로컬 UI/UX 시제품입니다.

목표:
- 26~33세 사회초년생이 내 조건 기준으로 신청 가능성이 높은 청년정책·지원금·저축상품·주거지원을 빠르게 파악하는 웹서비스를 만든다.
- v0.1은 외부 API 연동 없이 목업 정책 DB + 규칙 기반 매칭 엔진 + localStorage로 동작한다.
- 핵심 UX는 “정보 검색”이 아니라 “내 조건 판별 + 마감 D-day + 제출서류 체크리스트”다.
- 이 프로젝트는 zero-dependency static prototype이므로 새 패키지 추가는 최소화한다.

먼저 다음 파일을 읽고 현재 구조를 이해해줘.
- README.md
- AGENTS.md
- docs/PRODUCT_SPEC.md
- docs/DESIGN_GUIDE.md
- docs/SYSTEM_ARCHITECTURE.md
- docs/PRIVACY_AND_TRUST.md
- CODEX_TASKS.md
- src/main.js
- src/features/matching.js
- src/data/policies.js

그다음 아래 순서로 작업해줘.
1. 현재 앱 구조와 핵심 화면을 요약한다.
2. 매칭 로직/상태 관리/화면 구조에서 개선할 점을 찾는다.
3. CODEX_TASKS.md의 Phase 1부터 하나씩 진행한다.
4. 작업 후 npm run lint와 npm run build를 실행하고 결과를 보고한다.

주의:
- “100% 신청 가능”, “지원금 수령 확정” 같은 문구를 만들지 마라.
- 공식 심사와 실제 지원금 지급은 기관 판단이라는 안내를 유지하라.
- 개인정보는 최소 입력 원칙을 유지하고 주민등록번호·정확한 주소·회사명 입력을 만들지 마라.
```
