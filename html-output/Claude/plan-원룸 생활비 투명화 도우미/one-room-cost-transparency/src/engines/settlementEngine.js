import { numberOrZero, formatMoney } from './costEngine.js';

export function getMoveOutSettlement(room, overrides = {}) {
  const cleaningFee = numberOrZero(overrides.cleaningFee ?? room.moveOut?.cleaningFee ?? 80000);
  const repairFee = numberOrZero(overrides.repairFee ?? room.moveOut?.repairFee ?? 0);
  const unpaidUtility = numberOrZero(overrides.unpaidUtility ?? room.moveOut?.unpaidUtility ?? 42000);
  const unpaidRent = numberOrZero(overrides.unpaidRent ?? room.moveOut?.unpaidRent ?? 0);
  const maintenanceDue = numberOrZero(overrides.maintenanceDue ?? room.moveOut?.maintenanceDue ?? 0);
  const deposit = numberOrZero(room.deposit);
  const deductions = cleaningFee + repairFee + unpaidUtility + unpaidRent + maintenanceDue;

  return {
    deposit,
    deductions,
    finalReturnAmount: Math.max(0, deposit - deductions),
    items: [
      { label: '퇴실 청소비', amount: cleaningFee, confirmed: Boolean(room.contractTerms?.cleaningFeeConfirmed) },
      { label: '수리비', amount: repairFee, confirmed: Boolean(room.contractTerms?.repairRuleConfirmed) },
      { label: '마지막 공과금', amount: unpaidUtility, confirmed: false },
      { label: '미납 월세', amount: unpaidRent, confirmed: true },
      { label: '미납 관리비', amount: maintenanceDue, confirmed: true }
    ].filter((item) => item.amount > 0),
    memo: `예상 반환액은 ${formatMoney(Math.max(0, deposit - deductions))}입니다. 계약서와 실제 고지서 기준으로 다시 확인하세요.`
  };
}
