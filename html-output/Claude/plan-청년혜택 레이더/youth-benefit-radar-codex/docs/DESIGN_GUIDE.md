# 디자인 가이드

## 디자인 키워드

| 키워드 | 설명 |
|---|---|
| 명확함 | 사용자가 신청 가능성, 마감, 서류를 즉시 이해해야 함 |
| 신뢰감 | 정부정책과 금융성 상품을 다루므로 과한 장난스러운 톤 금지 |
| 친절함 | 행정 문구를 쉬운 말로 풀어줌 |
| 긴급함 | D-day와 마감 임박을 잘 보여줌 |
| 안전함 | 개인정보 최소 입력과 사전 매칭 안내를 명확히 표시 |

## 컬러 시스템

| 용도 | 토큰 | HEX |
|---|---|---|
| Primary | Radar Blue | `#2563EB` |
| Secondary | Youth Mint | `#14B8A6` |
| Success | Eligible Green | `#16A34A` |
| Warning | Check Amber | `#F59E0B` |
| Danger | Deadline Red | `#EF4444` |
| Premium | Benefit Purple | `#7C3AED` |
| Background | Soft Gray | `#F8FAFC` |
| Card | White | `#FFFFFF` |
| Text Primary | Navy Black | `#111827` |
| Text Secondary | Gray | `#6B7280` |
| Border | Light Gray | `#E5E7EB` |

## 타이포그래피

권장 폰트:
- Pretendard
- SUIT
- Noto Sans KR
- 시스템 sans-serif fallback

| 요소 | 크기 |
|---|---:|
| 핵심 숫자 | 32~40px |
| 카드 제목 | 18~20px |
| 섹션 제목 | 16~18px |
| 본문 | 14~16px |
| 보조 설명 | 12~13px |
| 버튼 | 15~16px |

## 레이아웃

- 모바일 우선: 390px 기준
- 데스크톱: 1120~1280px 콘텐츠 폭
- 카드 radius: 18~20px
- 카드 padding: 16~20px
- 버튼 높이: 48~56px
- 하단 탭: 홈 / 매칭 / 마감 / 서류 / 설정

## 주요 컴포넌트

### BenefitRadarSummary
- 신청 가능성 높은 혜택 수
- 예상 최대 지원 규모
- 이번 주 마감 수
- 오늘 해야 할 액션

### BenefitMatchCard
- 정책명
- 카테고리
- 신청 가능성 상태
- 매칭 점수
- 예상 혜택
- 마감 D-day
- 서류 수
- 상세보기 CTA

### EligibilityExplainPanel
- 내 조건과 정책 조건 비교
- 충족/추가확인/불일치 사유
- 공식 확인 안내

### DeadlineTimeline
- D-7, D-3, 마감일 상태 표시
- 상시 접수 별도 표시

### DocumentChecklist
- 서류명
- 발급처
- 발급 방법
- 준비 상태

## 접근성

- 색상만으로 상태를 표시하지 않는다.
- 모든 상태에는 텍스트 라벨을 함께 사용한다.
- 버튼에는 동사형 CTA를 쓴다.
- 금액과 D-day는 큰 글자로 배치한다.
