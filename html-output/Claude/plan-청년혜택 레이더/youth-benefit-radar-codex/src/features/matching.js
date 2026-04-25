import { getDaysLeft } from './deadlines.js';

function evaluateRule(rule, profile, policy) {
  const base = {
    ruleId: rule.id,
    plainText: rule.plainText,
    required: rule.required
  };

  if (rule.operator === 'requires_check') {
    const weightScore = rule.checkWeight === 'high' ? 50 : rule.checkWeight === 'medium' ? 65 : 75;
    return {
      ...base,
      status: 'needs_check',
      score: weightScore,
      message: `${rule.plainText}. 공식 기준 확인이 필요해요.`
    };
  }

  if (rule.operator === 'region_match') {
    const isNational = policy.regionScope === '전국';
    const sidoMatch = policy.regionSido ? policy.regionSido === profile.regionSido : false;
    const sigunguMatch = policy.regionSigungu ? policy.regionSigungu === profile.regionSigungu : true;
    const matched = isNational || (sidoMatch && sigunguMatch);
    return {
      ...base,
      status: matched ? 'matched' : 'failed',
      score: matched ? 100 : 0,
      message: matched
        ? `${profile.regionSido} ${profile.regionSigungu} 조건과 맞거나 전국 정책이에요.`
        : `${profile.regionSido} ${profile.regionSigungu} 조건과 맞지 않을 수 있어요.`
    };
  }

  if (rule.operator === 'interest_match') {
    const values = Array.isArray(rule.value) ? rule.value.map(String) : [];
    const matched = profile.interests.some((interest) => values.includes(interest));
    return {
      ...base,
      status: matched ? 'matched' : 'needs_check',
      score: matched ? 100 : 55,
      message: matched ? '관심 분야와 잘 맞아요.' : '관심 분야와 직접 일치하지는 않지만 확인해볼 수 있어요.'
    };
  }

  const profileValue = profile[rule.field];

  if (rule.operator === 'between') {
    const [min, max] = Array.isArray(rule.value) ? rule.value.map(Number) : [0, 0];
    const numericValue = Number(profileValue);
    const matched = numericValue >= min && numericValue <= max;
    return {
      ...base,
      status: matched ? 'matched' : 'failed',
      score: matched ? 100 : 0,
      message: matched ? `만 ${numericValue}세는 대상 범위에 포함돼요.` : `만 ${numericValue}세는 대상 범위와 맞지 않을 수 있어요.`
    };
  }

  if (rule.operator === 'equals') {
    const matched = String(profileValue) === String(rule.value);
    return {
      ...base,
      status: matched ? 'matched' : 'failed',
      score: matched ? 100 : 0,
      message: matched ? '입력한 조건과 일치해요.' : '입력한 조건과 일치하지 않아요.'
    };
  }

  if (rule.operator === 'one_of') {
    const values = Array.isArray(rule.value) ? rule.value.map(String) : [];
    const matched = values.includes(String(profileValue));
    return {
      ...base,
      status: matched ? 'matched' : 'failed',
      score: matched ? 100 : 0,
      message: matched ? '입력한 조건이 허용 범위에 포함돼요.' : '입력한 조건이 주요 대상과 다를 수 있어요.'
    };
  }

  return { ...base, status: 'needs_check', score: 50, message: '조건 해석이 필요해요.' };
}

function getStatus(evaluations, policy) {
  const daysLeft = getDaysLeft(policy.deadline.endDate);
  if (policy.deadline.status === 'closed' || (daysLeft !== null && daysLeft < 0)) return 'closed';

  const requiredFailures = evaluations.filter((evaluation) => evaluation.required && evaluation.status === 'failed');
  if (requiredFailures.length > 0) return 'not_eligible';

  const requiredChecks = evaluations.filter((evaluation) => evaluation.required && evaluation.status === 'needs_check');
  const anyChecks = evaluations.some((evaluation) => evaluation.status === 'needs_check');
  if (requiredChecks.length > 0 || anyChecks) return 'needs_check';

  return 'likely_eligible';
}

function getConfidence(evaluations, status) {
  if (status === 'closed' || status === 'not_eligible') return 'medium';
  const checkCount = evaluations.filter((evaluation) => evaluation.status === 'needs_check').length;
  if (checkCount >= 2) return 'low';
  if (checkCount === 1) return 'medium';
  return 'high';
}

export function matchPolicy(policy, profile) {
  const ruleEvaluations = policy.eligibilityRules.map((rule) => evaluateRule(rule, profile, policy));
  const requiredEvaluations = ruleEvaluations.filter((evaluation) => evaluation.required);
  const optionalEvaluations = ruleEvaluations.filter((evaluation) => !evaluation.required);

  const requiredScore = requiredEvaluations.length
    ? requiredEvaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / requiredEvaluations.length
    : 100;

  const optionalScore = optionalEvaluations.length
    ? optionalEvaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / optionalEvaluations.length
    : 80;

  const daysLeft = getDaysLeft(policy.deadline.endDate);
  const deadlineScore = daysLeft === null ? 82 : daysLeft < 0 ? 0 : daysLeft <= 3 ? 70 : daysLeft <= 14 ? 92 : 82;
  const score = Math.max(0, Math.min(100, Math.round(requiredScore * 0.68 + optionalScore * 0.18 + deadlineScore * 0.14)));
  const status = getStatus(ruleEvaluations, policy);

  return {
    policy,
    score: status === 'closed' ? Math.min(score, 30) : score,
    status,
    confidence: getConfidence(ruleEvaluations, status),
    matchedReasons: ruleEvaluations.filter((evaluation) => evaluation.status === 'matched').map((evaluation) => evaluation.message),
    checkReasons: ruleEvaluations.filter((evaluation) => evaluation.status === 'needs_check').map((evaluation) => evaluation.message),
    missingReasons: ruleEvaluations.filter((evaluation) => evaluation.status === 'failed').map((evaluation) => evaluation.message),
    ruleEvaluations,
    daysLeft
  };
}

export function matchPolicies(policies, profile) {
  const statusWeight = { likely_eligible: 4, needs_check: 3, not_eligible: 2, closed: 1 };
  return policies
    .map((policy) => matchPolicy(policy, profile))
    .sort((a, b) => {
      if (statusWeight[a.status] !== statusWeight[b.status]) return statusWeight[b.status] - statusWeight[a.status];
      return b.score - a.score;
    });
}
