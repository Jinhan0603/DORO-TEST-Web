# Jinhan Intro

김진한 대표 / 주식회사 도로 창업자 소개용 1페이지 사이트입니다.
현재 버전은 단순 이력서가 아니라, 대학·기관·협력 검토용 `founder-led corporate credibility page` 방향으로 정리되어 있습니다.

## 구성

- `index.html`: 메인 페이지
- `styles.css`: 레이아웃, 카드, 인쇄용 스타일
- `app.js`: 한글/영문 카피, 지표, 링크, 갤러리, 언어 전환 로직
- `assets/profile-photo.jpg`: 대표 프로필 사진
- `assets/jinhan-page-shot.png`: 공개 창업자 소개 페이지 캡처
- `assets/doro-homepage-shot.png`: DORO 공식 홈페이지 캡처
- `assets/kit-photo1.jpg`, `assets/kit-photo2.png`: 키트 / 제품 자산
- `assets/ces1.jpg`, `assets/ces2.jpg`: CES 2026 현장 이미지
- `assets/ip-summary-card.svg`: 선별 IP 요약 시각 카드
- `assets/proof-summary-card.svg`: 검증 / 사업화 요약 시각 카드
- `deploy-jinhan.cmd`: Windows 원클릭 배포 스크립트
- `deploy-jinhan.sh`: WSL / bash 배포 스크립트

## 현재 페이지 방향

- 상단: 창업자 프로필 + 선별 IP 요약
- 중단: 창업자 중심 회사 서사 + 해외 진출 / CES / 기관 협력 진척
- 하단: 기업 실적 / 지원사업 / 검증 포인트
- 시각 영역: 프로필, 공식 페이지 캡처, 키트, CES, IP / 검증 요약 카드

## 반영 기준

- 기업 정체성
  - 한국 기반 에듀테크 기업
  - AI, 로봇, 메이킹, 코딩, 디지털 교육 운영
  - 자체 콘텐츠 + 실습형 프로그램 + 구조화된 강사 운영 체계
- 주요 회사 지표
  - `57,922+` 누적 참여자
  - `2,224+` 누적 운영 클래스
  - `50+` 협력기관
  - `4.7 / 5.0` 평균 만족도
  - `72%` 재참여·재의뢰
- 공개 홈페이지 보조 지표
  - `5,206` 누적 교육 시간
  - `40,350` 누적 수강생
  - `4.7 / 5.0` 만족도
- 해외 / 검증
  - CES 2026 바이어 미팅 `14`
  - 비즈니스 미팅 `3`
  - 현장 구매 `1`
  - 공식 시험성적서 `4`
  - `PoC 1`
  - 프로젝트 매출 `85.62백만원`
  - 신규 채용 `1`

## 열기

1. `index.html`을 브라우저에서 엽니다.
2. 우측 상단 `KR / EN`으로 언어를 전환합니다.
3. `Print / PDF` 버튼으로 출력하거나 PDF로 저장합니다.

## 다음 업데이트부터 배포하는 방법

### Windows CMD / PowerShell

```cmd
deploy-jinhan.cmd
```

### WSL / bash

```bash
./deploy-jinhan.sh
```

이 스크립트는 아래를 한 번에 처리합니다.

1. `Jinhan intro` 폴더 내용을 `DORO-TEST-Web/jinhan`으로 동기화
2. `git add`
3. `git commit`
4. `git push origin main`

## 현재 공개 링크

- GitHub Pages: `https://jinhan0603.github.io/DORO-TEST-Web/jinhan/`
- GitHub repo: `https://github.com/Jinhan0603/DORO-TEST-Web`

## 수동 확인이 여전히 필요한 항목

- `코딩 교육용 교구 설계도 생성 시스템 외 특허·실용신안 5건`의 최종 표기 방식
  - 현재 제공 목록은 해석에 따라 총 `6개 항목`으로도 읽힐 수 있습니다.
- `85.62백만원`, `시험성적서 4건`, `PoC 1건`, `신규 채용 1건`이 외부 공개 페이지에 그대로 노출되어도 되는지 여부
- PDF 원본이 현재 작업 폴더에 없어, 특허 도면 / 인증서 원본 이미지는 아직 실제 스캔본으로 연결되지 않았습니다.
