# 시스템 구조도

## v0.1 로컬 시제품 구조

```mermaid
flowchart LR
    User[사용자] --> Browser[브라우저 / 로컬 웹앱]

    Browser --> UI[Vanilla JS UI Layer]
    UI --> State[JS State + localStorage]
    UI --> Components[Template Renderers]

    Components --> Dashboard[홈 대시보드]
    Components --> MatchList[혜택 매칭 리스트]
    Components --> Calendar[마감 타임라인]
    Components --> Checklist[서류 체크리스트]
    Components --> Detail[정책 상세]

    State --> Profile[사용자 조건 프로필]
    State --> Progress[서류 체크 상태]

    UI --> Engine[혜택 매칭 엔진]
    Engine --> PolicyDB[Mock Policy DB]
    Engine --> Score[매칭 점수]
    Engine --> Reason[매칭 사유]
    Engine --> Gap[추가 확인 사유]

    PolicyDB --> Policies[(src/data/policies.js)]
    Profile --> LocalStorage[(localStorage)]
```

## 코드 배치

| 영역 | 위치 |
|---|---|
| 정책 목업 DB | `src/data/policies.js` |
| 매칭 엔진 | `src/features/matching.js` |
| 마감 계산 | `src/features/deadlines.js` |
| 서류 계산 | `src/features/documents.js` |
| 포맷 유틸 | `src/lib/format.js` |
| localStorage | `src/lib/storage.js` |
| 화면 렌더링 | `src/main.js` |

## v1 확장 구조

```mermaid
flowchart TD
    App[청년혜택 레이더] --> Repository[Policy Repository]
    Repository --> Mock[Mock Repository]
    Repository --> YouthAPI[온통청년 API]
    Repository --> Gov24[정부24/보조금24 링크]
    Repository --> Manual[운영자 수동 등록]

    App --> RuleEngine[Rule Engine]
    App --> Reminder[Reminder Engine]
    App --> Document[Document Checklist]
    App --> ChangeLog[Policy Change Log]
```

## 개인정보 원칙

- 생년월일 대신 만 나이
- 정확한 연봉 대신 소득 구간
- 상세주소 대신 시/도, 시/군/구
- 회사명 대신 재직 상태/회사 유형
- v0.1은 서버 전송 없음
- 사용자가 조건을 초기화할 수 있어야 함
