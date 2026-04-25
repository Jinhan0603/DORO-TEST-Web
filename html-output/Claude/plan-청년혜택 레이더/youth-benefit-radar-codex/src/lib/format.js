export const CATEGORY_LABELS = {
  housing: '주거',
  savings: '저축',
  employment: '취업',
  living: '생활',
  transport: '교통',
  education: '교육',
  entrepreneurship: '창업'
};

export const EMPLOYMENT_LABELS = {
  employed: '재직 중',
  job_seeker: '구직 중',
  freelancer: '프리랜서',
  student: '학생',
  leaving_soon: '퇴사 예정'
};

export const HOUSING_LABELS = {
  monthly_rent: '월세',
  jeonse: '전세',
  with_parents: '부모님과 거주',
  moving_soon: '독립/이사 예정',
  own_home: '자가'
};

export const INCOME_LABELS = {
  under_2000: '2,000만 원 미만',
  '2000_3000': '2,000만~3,000만 원',
  '3000_4000': '3,000만~4,000만 원',
  '4000_5000': '4,000만~5,000만 원',
  '5000_6000': '5,000만~6,000만 원',
  over_6000: '6,000만 원 이상',
  unknown: '잘 모르겠음'
};

export const LIFE_EVENT_LABELS = {
  first_job: '첫 취업',
  moving_soon: '이사 예정',
  leaving_job: '퇴사 예정',
  marriage: '혼인 예정',
  none: '없음'
};

export const STATUS_LABELS = {
  likely_eligible: '신청 가능성 높음',
  needs_check: '추가 확인 필요',
  not_eligible: '현재 조건상 어려움',
  closed: '마감됨'
};

export function formatMoney(value) {
  if (value >= 10000) {
    const man = Math.round(value / 10000);
    return `${man.toLocaleString('ko-KR')}만 원`;
  }
  return `${value.toLocaleString('ko-KR')}원`;
}

export function formatDate(dateString) {
  if (!dateString) return '상시';
  const date = new Date(`${dateString}T00:00:00+09:00`);
  return new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' }).format(date);
}

export function statusClassName(status) {
  return {
    likely_eligible: 'status-green',
    needs_check: 'status-amber',
    not_eligible: 'status-gray',
    closed: 'status-red'
  }[status] ?? 'status-gray';
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
