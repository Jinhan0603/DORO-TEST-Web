import { getRiskSignals } from './riskEngine.js';

export const baseChecklist = [
  {
    id: 'maintenance-detail',
    category: '관리비',
    title: '관리비 세부 항목을 계약서에 적기',
    question: '관리비에 포함된 항목과 항목별 금액을 계약서에 적을 수 있을까요?',
    important: true
  },
  {
    id: 'electricity-meter',
    category: '공과금',
    title: '전기 계량기 단독 여부 확인',
    question: '전기 계량기는 호실별 단독 계량기인가요?',
    important: true
  },
  {
    id: 'gas-payment',
    category: '공과금',
    title: '가스요금 납부 방식 확인',
    question: '가스요금은 개별 납부인가요, 관리비에 포함인가요?',
    important: true
  },
  {
    id: 'internet',
    category: '관리비',
    title: '인터넷 포함 여부 확인',
    question: '인터넷은 건물 제공인가요, 개인 설치가 필요한가요?',
    important: false
  },
  {
    id: 'water',
    category: '관리비',
    title: '수도요금 포함 여부 확인',
    question: '수도요금은 관리비 포함인가요, 별도 정산인가요?',
    important: true
  },
  {
    id: 'cleaning-fee',
    category: '퇴실',
    title: '퇴실 청소비 금액과 기준 확인',
    question: '퇴실 청소비가 있다면 금액과 기준을 계약서에 적을 수 있을까요?',
    important: true
  },
  {
    id: 'repair-rule',
    category: '퇴실',
    title: '벽지·장판·수리비 차감 기준 확인',
    question: '생활 마모와 파손의 수리비 기준은 어떻게 정하나요?',
    important: true
  },
  {
    id: 'final-utility',
    category: '퇴실',
    title: '마지막 공과금 정산 방식 확인',
    question: '퇴실일 기준 전기·가스·수도는 어떻게 정산하나요?',
    important: false
  }
];

export function getChecklistForRoom(room) {
  const signals = getRiskSignals(room);
  const flaggedIds = new Set();

  signals.forEach((signal) => {
    if (signal.type === 'maintenance_unclear') flaggedIds.add('maintenance-detail');
    if (signal.type === 'electricity_meter') flaggedIds.add('electricity-meter');
    if (signal.type === 'move_out_cleaning') flaggedIds.add('cleaning-fee');
    if (signal.type === 'unknown_items') {
      flaggedIds.add('water');
      flaggedIds.add('internet');
    }
  });

  return baseChecklist.map((item) => ({
    ...item,
    priority: flaggedIds.has(item.id) || item.important ? 'high' : 'normal',
    reason: flaggedIds.has(item.id) ? '이 방의 위험 신호와 연결됨' : item.important ? '계약 전 기본 확인 항목' : '선택 확인 항목'
  }));
}
