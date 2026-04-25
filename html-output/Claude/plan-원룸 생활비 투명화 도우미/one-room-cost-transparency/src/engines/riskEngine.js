import { getCostSummary, numberOrZero } from './costEngine.js';

const highMaintenanceThreshold = 100000;
const unclearIncludedItemThreshold = 3;

export function getIncludedItems(room) {
  return Object.entries(room.maintenanceItems ?? {})
    .filter(([, value]) => value === true)
    .map(([key]) => key);
}

export function getUnknownItems(room) {
  return Object.entries(room.maintenanceItems ?? {})
    .filter(([, value]) => value === 'unknown')
    .map(([key]) => key);
}

export function getTransparencyScore(room) {
  let score = 100;
  const included = getIncludedItems(room);
  const unknown = getUnknownItems(room);

  if (numberOrZero(room.maintenanceFee) > 0 && included.length === 0) score -= 20;
  if (numberOrZero(room.maintenanceFee) >= highMaintenanceThreshold && included.length < unclearIncludedItemThreshold) score -= 18;
  if (unknown.length >= 2) score -= 12;
  if (!room.electricityMeterConfirmed) score -= 12;
  if (!room.gasPaymentConfirmed) score -= 10;
  if (!room.heatingType || room.heatingType === 'unknown') score -= 10;
  if (!room.contractTerms?.cleaningFeeConfirmed) score -= 10;
  if (!room.contractTerms?.repairRuleConfirmed) score -= 10;
  if (!room.contractTerms?.maintenanceWritten) score -= 13;
  if (!room.hasMonthlyBillHistory) score -= 8;

  return Math.max(0, Math.min(100, score));
}

export function getTransparencyStatus(score) {
  if (score >= 80) return { label: '명확', tone: 'success' };
  if (score >= 60) return { label: '일부 확인 필요', tone: 'warning' };
  if (score >= 40) return { label: '불명확', tone: 'danger' };
  return { label: '계약 전 강한 확인 필요', tone: 'danger' };
}

export function getRiskSignals(room) {
  const summary = getCostSummary(room);
  const included = getIncludedItems(room);
  const unknown = getUnknownItems(room);
  const signals = [];

  if (numberOrZero(room.maintenanceFee) >= highMaintenanceThreshold && included.length < unclearIncludedItemThreshold) {
    signals.push({
      type: 'maintenance_unclear',
      severity: 'warning',
      title: '관리비 세부항목 확인 필요',
      description: '관리비가 높은 편이지만 포함 항목이 충분히 구분되어 있지 않습니다.',
      recommendedQuestion: '관리비에 포함된 항목과 항목별 금액을 계약서에 적을 수 있을까요?'
    });
  }

  if (unknown.length > 0) {
    signals.push({
      type: 'unknown_items',
      severity: 'warning',
      title: '포함 여부가 불명확한 항목이 있어요',
      description: `${unknown.length}개 항목의 포함 여부가 아직 확인되지 않았습니다.`,
      recommendedQuestion: '수도, 인터넷, 공용전기, 청소비가 관리비에 포함인지 정확히 확인할 수 있을까요?'
    });
  }

  if (!room.electricityMeterConfirmed) {
    signals.push({
      type: 'electricity_meter',
      severity: 'danger',
      title: '전기 계량기 단독 여부 확인 필요',
      description: '공동 계량 또는 임의 분배 방식이면 요금 분쟁이 생길 수 있습니다.',
      recommendedQuestion: '전기 계량기는 호실별 단독 계량기인가요?'
    });
  }

  if (summary.winter.total - summary.normal.total >= 80000) {
    signals.push({
      type: 'winter_heating',
      severity: 'danger',
      title: '겨울 난방비 변동 가능성',
      description: '겨울 예상 주거비가 평상시보다 크게 높아집니다.',
      recommendedQuestion: '지난 겨울 평균 가스비나 난방비가 어느 정도였나요?'
    });
  }

  if (summary.hiddenMonthlyGap >= 150000) {
    signals.push({
      type: 'hidden_gap',
      severity: 'warning',
      title: '광고 월세와 실제 부담액 차이가 커요',
      description: '월세 외 관리비·공과금·보증금 기회비용까지 더하면 차이가 큽니다.',
      recommendedQuestion: '월세 외 매월 고정적으로 나가는 비용이 더 있는지 확인할 수 있을까요?'
    });
  }

  if (!room.contractTerms?.cleaningFeeConfirmed) {
    signals.push({
      type: 'move_out_cleaning',
      severity: 'warning',
      title: '퇴실 청소비 기준 확인 필요',
      description: '퇴실 때 보증금에서 차감되는 비용은 계약서에 명확히 적는 것이 안전합니다.',
      recommendedQuestion: '퇴실 청소비가 있다면 금액과 기준을 계약서에 적을 수 있을까요?'
    });
  }

  return signals;
}
