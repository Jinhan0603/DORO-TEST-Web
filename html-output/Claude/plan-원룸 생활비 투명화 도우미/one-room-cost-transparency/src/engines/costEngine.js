export const DEFAULT_OPPORTUNITY_RATE = 0.035;

export function numberOrZero(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatMoney(value) {
  return `${Math.round(numberOrZero(value)).toLocaleString('ko-KR')}원`;
}

export function formatCompact(value) {
  const amount = Math.round(numberOrZero(value));
  if (amount >= 10000) {
    const man = amount / 10000;
    return `${Number.isInteger(man) ? man.toFixed(0) : man.toFixed(1)}만`;
  }
  return amount.toLocaleString('ko-KR');
}

export function getDepositOpportunityCost(deposit, annualRate = DEFAULT_OPPORTUNITY_RATE) {
  return Math.round((numberOrZero(deposit) * numberOrZero(annualRate)) / 12);
}

export function getUtilityCost(room, season = 'normal') {
  const utilities = room.utilities ?? {};
  const result = {
    electricity: 0,
    gas: 0,
    water: 0,
    internet: 0,
    parking: 0,
    other: numberOrZero(room.otherMonthlyCost)
  };

  const seasonKey = season === 'summer' ? 'summer' : season === 'winter' ? 'winter' : 'normal';

  Object.entries(utilities).forEach(([key, utility]) => {
    if (!utility || utility.includedInMaintenance) return;
    result[key] = numberOrZero(utility[seasonKey] ?? utility.normal);
  });

  result.internet = room.includesInternet ? 0 : numberOrZero(room.internetFee);
  result.parking = room.includesParking ? 0 : numberOrZero(room.parkingFee);
  return result;
}

export function sumUtilityCost(utilityCost) {
  return Object.values(utilityCost).reduce((sum, value) => sum + numberOrZero(value), 0);
}

export function getSeasonalCost(room, season = 'normal') {
  const utilityCost = getUtilityCost(room, season);
  const depositCost = room.includeDepositOpportunityCost
    ? getDepositOpportunityCost(room.deposit, room.opportunityRate)
    : 0;

  return {
    season,
    rent: numberOrZero(room.monthlyRent),
    maintenance: numberOrZero(room.maintenanceFee),
    utilityCost,
    depositOpportunityCost: depositCost,
    total:
      numberOrZero(room.monthlyRent) +
      numberOrZero(room.maintenanceFee) +
      sumUtilityCost(utilityCost) +
      depositCost
  };
}

export function getCostSummary(room) {
  const normal = getSeasonalCost(room, 'normal');
  const summer = getSeasonalCost(room, 'summer');
  const winter = getSeasonalCost(room, 'winter');
  const advertisedRent = numberOrZero(room.monthlyRent);

  return {
    normal,
    summer,
    winter,
    advertisedRent,
    hiddenMonthlyGap: normal.total - advertisedRent,
    maxSeasonalTotal: Math.max(normal.total, summer.total, winter.total),
    maxSeasonalGap: Math.max(summer.total, winter.total) - normal.total,
    cheapestSeason: [normal, summer, winter].sort((a, b) => a.total - b.total)[0].season,
    mostExpensiveSeason: [normal, summer, winter].sort((a, b) => b.total - a.total)[0].season
  };
}

export function getCostBreakdown(room, season = 'normal') {
  const summary = getSeasonalCost(room, season);
  const rawItems = [
    { key: 'rent', label: '월세', amount: summary.rent, type: 'fixed' },
    { key: 'maintenance', label: '관리비', amount: summary.maintenance, type: 'fixed' },
    { key: 'electricity', label: '전기', amount: summary.utilityCost.electricity, type: 'variable' },
    { key: 'gas', label: '가스', amount: summary.utilityCost.gas, type: 'variable' },
    { key: 'water', label: '수도', amount: summary.utilityCost.water, type: 'variable' },
    { key: 'internet', label: '인터넷', amount: summary.utilityCost.internet, type: 'fixed' },
    { key: 'parking', label: '주차', amount: summary.utilityCost.parking, type: 'fixed' },
    { key: 'other', label: '기타', amount: summary.utilityCost.other, type: 'other' },
    { key: 'deposit', label: '보증금 기회비용', amount: summary.depositOpportunityCost, type: 'hidden' }
  ];

  return rawItems
    .filter((item) => item.amount > 0)
    .map((item) => ({
      ...item,
      percent: summary.total > 0 ? Math.round((item.amount / summary.total) * 1000) / 10 : 0
    }));
}

export function getMonthlyWave(room) {
  const normal = getSeasonalCost(room, 'normal').total;
  const summer = getSeasonalCost(room, 'summer').total;
  const winter = getSeasonalCost(room, 'winter').total;

  return [
    { month: '1월', cost: winter },
    { month: '2월', cost: winter - 12000 },
    { month: '3월', cost: normal + 12000 },
    { month: '4월', cost: normal },
    { month: '5월', cost: normal },
    { month: '6월', cost: summer - 18000 },
    { month: '7월', cost: summer },
    { month: '8월', cost: summer + 14000 },
    { month: '9월', cost: normal + 8000 },
    { month: '10월', cost: normal },
    { month: '11월', cost: winter - 30000 },
    { month: '12월', cost: winter }
  ];
}

export function cloneRoom(room) {
  return JSON.parse(JSON.stringify(room));
}
