export const maintenanceLabels = {
  internet: '인터넷',
  water: '수도',
  commonElectricity: '공용전기',
  cleaning: '청소비',
  elevator: '엘리베이터',
  security: '경비비',
  parking: '주차',
  tv: 'TV'
};

export const seasonLabels = {
  normal: '평상시',
  summer: '여름',
  winter: '겨울'
};

export const roomCandidates = [
  {
    id: 'room-a',
    name: '홍대입구역 5분 원룸',
    housingType: '원룸',
    region: '서울 마포구',
    areaPyeong: 6.5,
    deposit: 10000000,
    monthlyRent: 520000,
    maintenanceFee: 80000,
    maintenancePaymentType: '정액',
    maintenanceItems: {
      internet: true,
      water: true,
      commonElectricity: true,
      cleaning: true,
      elevator: 'unknown',
      security: false,
      parking: false,
      tv: false
    },
    heatingType: '도시가스 개별난방',
    electricityMeterConfirmed: false,
    gasPaymentConfirmed: true,
    includesInternet: true,
    includesParking: false,
    internetFee: 22000,
    parkingFee: 0,
    otherMonthlyCost: 0,
    includeDepositOpportunityCost: true,
    opportunityRate: 0.035,
    hasMonthlyBillHistory: false,
    utilities: {
      electricity: { includedInMaintenance: false, normal: 24000, summer: 62000, winter: 28000 },
      gas: { includedInMaintenance: false, normal: 38000, summer: 12000, winter: 118000 },
      water: { includedInMaintenance: true, normal: 12000, summer: 14000, winter: 12000 }
    },
    contractTerms: {
      cleaningFeeConfirmed: false,
      repairRuleConfirmed: false,
      maintenanceWritten: false
    },
    moveOut: {
      cleaningFee: 80000,
      repairFee: 0,
      unpaidUtility: 42000
    }
  },
  {
    id: 'room-b',
    name: '강남역 소형 오피스텔',
    housingType: '오피스텔',
    region: '서울 강남구',
    areaPyeong: 7.2,
    deposit: 15000000,
    monthlyRent: 450000,
    maintenanceFee: 150000,
    maintenancePaymentType: '정액',
    maintenanceItems: {
      internet: false,
      water: 'unknown',
      commonElectricity: true,
      cleaning: true,
      elevator: true,
      security: true,
      parking: false,
      tv: false
    },
    heatingType: '전기난방',
    electricityMeterConfirmed: true,
    gasPaymentConfirmed: false,
    includesInternet: false,
    includesParking: false,
    internetFee: 25000,
    parkingFee: 0,
    otherMonthlyCost: 10000,
    includeDepositOpportunityCost: true,
    opportunityRate: 0.035,
    hasMonthlyBillHistory: false,
    utilities: {
      electricity: { includedInMaintenance: false, normal: 48000, summer: 92000, winter: 145000 },
      gas: { includedInMaintenance: true, normal: 0, summer: 0, winter: 0 },
      water: { includedInMaintenance: false, normal: 14000, summer: 16000, winter: 14000 }
    },
    contractTerms: {
      cleaningFeeConfirmed: false,
      repairRuleConfirmed: false,
      maintenanceWritten: true
    },
    moveOut: {
      cleaningFee: 120000,
      repairFee: 0,
      unpaidUtility: 78000
    }
  },
  {
    id: 'room-c',
    name: '성수동 다가구 원룸',
    housingType: '다가구',
    region: '서울 성동구',
    areaPyeong: 6.8,
    deposit: 8000000,
    monthlyRent: 580000,
    maintenanceFee: 50000,
    maintenancePaymentType: '정액',
    maintenanceItems: {
      internet: true,
      water: true,
      commonElectricity: true,
      cleaning: false,
      elevator: false,
      security: false,
      parking: false,
      tv: false
    },
    heatingType: '도시가스 개별난방',
    electricityMeterConfirmed: true,
    gasPaymentConfirmed: true,
    includesInternet: true,
    includesParking: false,
    internetFee: 0,
    parkingFee: 0,
    otherMonthlyCost: 0,
    includeDepositOpportunityCost: true,
    opportunityRate: 0.035,
    hasMonthlyBillHistory: true,
    utilities: {
      electricity: { includedInMaintenance: false, normal: 22000, summer: 52000, winter: 25000 },
      gas: { includedInMaintenance: false, normal: 28000, summer: 10000, winter: 88000 },
      water: { includedInMaintenance: true, normal: 12000, summer: 13000, winter: 12000 }
    },
    contractTerms: {
      cleaningFeeConfirmed: true,
      repairRuleConfirmed: true,
      maintenanceWritten: true
    },
    moveOut: {
      cleaningFee: 50000,
      repairFee: 0,
      unpaidUtility: 33000
    }
  }
];

export const monthlyBills = [
  { month: '2026-01', rent: 520000, maintenance: 80000, electricity: 29000, gas: 126000, water: 0, other: 0 },
  { month: '2026-02', rent: 520000, maintenance: 80000, electricity: 28000, gas: 112000, water: 0, other: 0 },
  { month: '2026-03', rent: 520000, maintenance: 80000, electricity: 23000, gas: 45000, water: 0, other: 0 },
  { month: '2026-04', rent: 520000, maintenance: 80000, electricity: 23400, gas: 31800, water: 0, other: 0 }
];
