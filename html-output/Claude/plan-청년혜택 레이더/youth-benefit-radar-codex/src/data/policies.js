export const DEFAULT_PROFILE = {
  id: 'local-user',
  age: 29,
  regionSido: '서울특별시',
  regionSigungu: '마포구',
  incomeRange: '3000_4000',
  employmentStatus: 'employed',
  companyType: 'small_medium',
  housingStatus: 'monthly_rent',
  householdType: 'single',
  lifeEvent: 'moving_soon',
  interests: ['housing', 'savings', 'living']
};

export const POLICIES = [
  {
    id: 'policy_youth_monthly_rent_mock',
    title: '청년월세 지원 매칭 예시',
    category: 'housing',
    provider: '국토교통부/지자체',
    regionScope: '전국',
    summary: '월세로 거주하는 청년의 주거비 부담을 줄이기 위한 지원 제도 예시입니다. 실제 신청 전 공식 공고 확인이 필요합니다.',
    estimatedValueLabel: '월 최대 20만 원 수준 지원 가능성',
    estimatedValue: 2400000,
    sourceLabel: '공식 공고 확인 필요',
    cautionNote: '소득·주거·가구 기준은 실제 신청 시 공식 기준으로 다시 확인해야 합니다.',
    isFinancialProduct: false,
    lastCheckedAt: '2026-04-24',
    eligibilityRules: [
      { id: 'age', field: 'age', operator: 'between', value: [19, 34], required: true, plainText: '만 19~34세 청년 대상' },
      { id: 'housing', field: 'housingStatus', operator: 'one_of', value: ['monthly_rent', 'moving_soon'], required: true, plainText: '월세 거주 또는 독립 예정자 중심' },
      { id: 'region', field: 'region', operator: 'region_match', value: null, required: false, plainText: '전국 또는 거주 지자체 조건 확인' },
      { id: 'income', field: 'incomeRange', operator: 'requires_check', value: null, required: true, plainText: '소득 및 가구 기준 추가 확인 필요', checkWeight: 'high' }
    ],
    requiredDocuments: [
      { id: 'resident_register', name: '주민등록등본', issuer: '정부24', issueMethod: '온라인 발급', required: true, memo: '최근 발급본 요구 여부 확인' },
      { id: 'lease_contract', name: '임대차계약서', issuer: '본인 보관', issueMethod: '계약서 사본 준비', required: true },
      { id: 'rent_payment', name: '월세 납입 증빙', issuer: '은행/카드사', issueMethod: '이체내역 또는 카드내역', required: true },
      { id: 'income_doc', name: '소득 확인 서류', issuer: '국세청/건보공단', issueMethod: '대상 기준 확인 후 발급', required: true },
      { id: 'bankbook_copy', name: '통장 사본', issuer: '은행', issueMethod: '앱 또는 인터넷뱅킹', required: false }
    ],
    deadline: { startDate: '2026-04-01', endDate: '2026-05-10', status: 'open' }
  },
  {
    id: 'policy_youth_leap_savings_mock',
    title: '청년도약계좌 조건 체크 예시',
    category: 'savings',
    provider: '금융위원회/서민금융진흥원',
    regionScope: '전국',
    summary: '청년의 중장기 자산형성을 돕는 정책금융상품 조건 체크 예시입니다. 가입 권유가 아니며 은행과 공식 안내 확인이 필요합니다.',
    estimatedValueLabel: '정부기여금·비과세 혜택 가능성',
    estimatedValue: 1980000,
    sourceLabel: '공식 금융기관 안내 확인 필요',
    cautionNote: '정책금융상품은 가입 기간, 소득요건, 중도해지 조건을 반드시 공식 안내에서 확인해야 합니다.',
    isFinancialProduct: true,
    lastCheckedAt: '2026-04-24',
    eligibilityRules: [
      { id: 'age', field: 'age', operator: 'between', value: [19, 34], required: true, plainText: '청년 연령 조건 확인' },
      { id: 'income', field: 'incomeRange', operator: 'requires_check', value: null, required: true, plainText: '개인소득 및 가구소득 조건 확인 필요', checkWeight: 'high' },
      { id: 'employment', field: 'employmentStatus', operator: 'one_of', value: ['employed', 'freelancer', 'job_seeker'], required: false, plainText: '소득 신고 또는 소득 확인 가능 여부 확인' },
      { id: 'interest', field: 'interest', operator: 'interest_match', value: ['savings'], required: false, plainText: '저축·자산형성 관심 분야와 관련' }
    ],
    requiredDocuments: [
      { id: 'id_card', name: '신분 확인 서류', issuer: '본인', issueMethod: '은행 앱 또는 지점 기준 확인', required: true },
      { id: 'income_check', name: '소득 확인 자료', issuer: '국세청/서민금융진흥원', issueMethod: '가입 심사 과정에서 확인', required: true },
      { id: 'bank_app', name: '은행 앱 신청 정보', issuer: '취급 은행', issueMethod: '은행별 신청 절차 확인', required: true }
    ],
    deadline: { startDate: '2026-04-01', endDate: '2026-05-31', status: 'open' }
  },
  {
    id: 'policy_seoul_transport_mock',
    title: '지역 청년 교통비 지원 예시',
    category: 'transport',
    provider: '서울특별시/지자체',
    regionScope: '지역',
    regionSido: '서울특별시',
    summary: '서울 거주 청년의 교통비 부담을 줄이기 위한 지역형 지원 정책 예시입니다.',
    estimatedValueLabel: '연 최대 10만 원 수준 지원 가능성',
    estimatedValue: 100000,
    sourceLabel: '지자체 공고 확인 필요',
    cautionNote: '연령·거주·사용 교통카드 등 세부 조건은 매년 바뀔 수 있습니다.',
    isFinancialProduct: false,
    lastCheckedAt: '2026-04-24',
    eligibilityRules: [
      { id: 'age', field: 'age', operator: 'between', value: [19, 34], required: true, plainText: '청년 연령 조건' },
      { id: 'region', field: 'region', operator: 'region_match', value: null, required: true, plainText: '서울 거주 조건' },
      { id: 'interest', field: 'interest', operator: 'interest_match', value: ['transport', 'living'], required: false, plainText: '생활비·교통비 관심 분야와 관련' }
    ],
    requiredDocuments: [
      { id: 'resident_register', name: '주민등록등본', issuer: '정부24', issueMethod: '온라인 발급', required: true },
      { id: 'transport_card', name: '교통카드 정보', issuer: '카드사/앱', issueMethod: '사용 카드번호 또는 이용내역 확인', required: true }
    ],
    deadline: { startDate: '2026-04-12', endDate: '2026-04-30', status: 'open' }
  },
  {
    id: 'policy_moving_cost_mock',
    title: '청년 이사비·중개보수 지원 예시',
    category: 'housing',
    provider: '지자체',
    regionScope: '지역',
    regionSido: '서울특별시',
    summary: '독립 또는 이사 예정 청년이 이사비와 중개보수 부담을 줄일 수 있는 지역형 지원 예시입니다.',
    estimatedValueLabel: '최대 40만 원 수준 지원 가능성',
    estimatedValue: 400000,
    sourceLabel: '지자체 공고 확인 필요',
    cautionNote: '이사일, 계약일, 전입신고일 기준이 다를 수 있으므로 공식 공고 확인이 필요합니다.',
    isFinancialProduct: false,
    lastCheckedAt: '2026-04-24',
    eligibilityRules: [
      { id: 'age', field: 'age', operator: 'between', value: [19, 39], required: true, plainText: '청년 연령 조건' },
      { id: 'region', field: 'region', operator: 'region_match', value: null, required: true, plainText: '해당 지자체 거주 또는 전입 조건' },
      { id: 'life_event', field: 'lifeEvent', operator: 'one_of', value: ['moving_soon', 'first_job'], required: false, plainText: '이사·독립 이벤트와 관련' },
      { id: 'income', field: 'incomeRange', operator: 'requires_check', value: null, required: true, plainText: '소득 또는 재산 기준 추가 확인 필요', checkWeight: 'medium' }
    ],
    requiredDocuments: [
      { id: 'lease_contract', name: '임대차계약서', issuer: '본인 보관', issueMethod: '계약서 사본 준비', required: true },
      { id: 'moving_receipt', name: '이사비 영수증', issuer: '이사업체/플랫폼', issueMethod: '결제 영수증 또는 거래내역', required: true },
      { id: 'brokerage_receipt', name: '중개보수 영수증', issuer: '공인중개사', issueMethod: '중개보수 납부 증빙', required: false },
      { id: 'resident_register', name: '주민등록등본', issuer: '정부24', issueMethod: '전입 후 발급 기준 확인', required: true }
    ],
    deadline: { startDate: '2026-04-20', endDate: '2026-05-15', status: 'open' }
  },
  {
    id: 'policy_sme_welfare_mock',
    title: '중소기업 재직 청년 복지포인트 예시',
    category: 'living',
    provider: '지자체/공공기관',
    regionScope: '지역',
    regionSido: '경기도',
    summary: '중소기업 재직 청년의 복지비를 지원하는 지역형 정책 예시입니다.',
    estimatedValueLabel: '연 최대 120만 원 수준 지원 가능성',
    estimatedValue: 1200000,
    sourceLabel: '지자체 공고 확인 필요',
    cautionNote: '근무지 소재지, 기업 규모, 재직 기간, 4대보험 가입 여부 확인이 필요합니다.',
    isFinancialProduct: false,
    lastCheckedAt: '2026-04-24',
    eligibilityRules: [
      { id: 'age', field: 'age', operator: 'between', value: [19, 39], required: true, plainText: '청년 연령 조건' },
      { id: 'region', field: 'region', operator: 'region_match', value: null, required: true, plainText: '해당 지자체 거주 또는 근무지 조건' },
      { id: 'employment', field: 'employmentStatus', operator: 'equals', value: 'employed', required: true, plainText: '재직자 대상' },
      { id: 'company', field: 'companyType', operator: 'one_of', value: ['small_medium', 'unknown'], required: true, plainText: '중소기업 재직 여부 확인' },
      { id: 'income', field: 'incomeRange', operator: 'requires_check', value: null, required: true, plainText: '건강보험료 또는 월 급여 기준 확인 필요', checkWeight: 'medium' }
    ],
    requiredDocuments: [
      { id: 'employment_certificate', name: '재직증명서', issuer: '회사', issueMethod: '회사 또는 인사 시스템 발급', required: true },
      { id: 'insurance_certificate', name: '4대보험 가입확인서', issuer: '4대사회보험 정보연계센터', issueMethod: '온라인 발급', required: true },
      { id: 'income_doc', name: '소득 확인 서류', issuer: '건보공단/회사', issueMethod: '공고 기준에 따라 확인', required: true }
    ],
    deadline: { startDate: '2026-05-01', endDate: '2026-05-24', status: 'upcoming' }
  },
  {
    id: 'policy_job_support_mock',
    title: '청년 취업지원 프로그램 예시',
    category: 'employment',
    provider: '고용노동부/지자체',
    regionScope: '전국',
    summary: '구직 청년을 대상으로 상담, 직무교육, 취업 준비 비용 등을 지원하는 프로그램 예시입니다.',
    estimatedValueLabel: '상담·교육·수당 지원 가능성',
    estimatedValue: 500000,
    sourceLabel: '공식 취업지원 포털 확인 필요',
    cautionNote: '재직 중인 경우 대상에서 제외되거나 별도 유형으로 분류될 수 있습니다.',
    isFinancialProduct: false,
    lastCheckedAt: '2026-04-24',
    eligibilityRules: [
      { id: 'age', field: 'age', operator: 'between', value: [18, 34], required: true, plainText: '청년 연령 조건' },
      { id: 'employment', field: 'employmentStatus', operator: 'one_of', value: ['job_seeker', 'student', 'leaving_soon'], required: true, plainText: '구직자 또는 취업 준비 상태 중심' },
      { id: 'income', field: 'incomeRange', operator: 'requires_check', value: null, required: false, plainText: '일부 유형은 소득 기준 확인 필요', checkWeight: 'low' },
      { id: 'interest', field: 'interest', operator: 'interest_match', value: ['employment', 'education'], required: false, plainText: '취업·교육 관심 분야와 관련' }
    ],
    requiredDocuments: [
      { id: 'application_form', name: '참여 신청서', issuer: '운영기관', issueMethod: '온라인 작성', required: true },
      { id: 'job_status_doc', name: '구직 상태 확인 자료', issuer: '고용 포털/본인', issueMethod: '유형별 확인', required: false }
    ],
    deadline: { startDate: '2026-03-01', endDate: null, status: 'always' }
  },
  {
    id: 'policy_youth_mental_health_mock',
    title: '청년 마음건강 상담 지원 예시',
    category: 'living',
    provider: '보건복지부/지자체',
    regionScope: '전국',
    summary: '청년의 심리상담 비용 부담을 줄이는 생활·건강 지원 정책 예시입니다.',
    estimatedValueLabel: '상담 바우처 또는 비용 지원 가능성',
    estimatedValue: 600000,
    sourceLabel: '복지로/지자체 공고 확인 필요',
    cautionNote: '지역별 접수 기간과 본인부담금이 다를 수 있습니다.',
    isFinancialProduct: false,
    lastCheckedAt: '2026-04-24',
    eligibilityRules: [
      { id: 'age', field: 'age', operator: 'between', value: [19, 34], required: true, plainText: '청년 연령 조건' },
      { id: 'region', field: 'region', operator: 'region_match', value: null, required: false, plainText: '거주 지역별 접수기관 확인' },
      { id: 'interest', field: 'interest', operator: 'interest_match', value: ['living'], required: false, plainText: '생활·복지 관심 분야와 관련' }
    ],
    requiredDocuments: [
      { id: 'application_form', name: '서비스 신청서', issuer: '행정복지센터/온라인', issueMethod: '지역별 신청 경로 확인', required: true },
      { id: 'resident_register', name: '주민등록등본', issuer: '정부24', issueMethod: '온라인 발급', required: false }
    ],
    deadline: { startDate: '2026-01-01', endDate: null, status: 'always' }
  }
];
