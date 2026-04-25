export const PROTOTYPE_TODAY = new Date('2026-04-24T09:00:00+09:00');

export function getDaysLeft(endDate, today = PROTOTYPE_TODAY) {
  if (!endDate) return null;
  const deadline = new Date(`${endDate}T23:59:59+09:00`);
  const diffMs = deadline.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getDeadlineLabel(policy) {
  if (policy.deadline.status === 'always' || !policy.deadline.endDate) return '상시';
  const daysLeft = getDaysLeft(policy.deadline.endDate);
  if (daysLeft === null) return '상시';
  if (daysLeft < 0) return '마감';
  if (daysLeft === 0) return '오늘 마감';
  return `D-${daysLeft}`;
}

export function getDeadlineUrgency(policy) {
  if (policy.deadline.status === 'always' || !policy.deadline.endDate) return 'always';
  const daysLeft = getDaysLeft(policy.deadline.endDate);
  if (daysLeft === null) return 'always';
  if (daysLeft < 0) return 'closed';
  if (daysLeft <= 3) return 'urgent';
  if (daysLeft <= 7) return 'soon';
  return 'safe';
}
