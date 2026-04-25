import { DEFAULT_PROFILE, POLICIES } from './data/policies.js';
import { matchPolicies } from './features/matching.js';
import { getDeadlineLabel, getDeadlineUrgency } from './features/deadlines.js';
import { getDocumentProgress } from './features/documents.js';
import { readStorage, removeStorage, writeStorage } from './lib/storage.js';
import {
  CATEGORY_LABELS,
  EMPLOYMENT_LABELS,
  HOUSING_LABELS,
  INCOME_LABELS,
  LIFE_EVENT_LABELS,
  STATUS_LABELS,
  escapeHtml,
  formatDate,
  formatMoney,
  statusClassName
} from './lib/format.js';

const PROFILE_KEY = 'youth-benefit-radar-profile';
const DOCUMENT_KEY = 'youth-benefit-radar-documents';

const state = {
  profile: readStorage(PROFILE_KEY, DEFAULT_PROFILE),
  documentProgress: readStorage(DOCUMENT_KEY, []),
  view: 'dashboard',
  activeStatus: 'all',
  selectedPolicyId: null
};

const app = document.querySelector('#app');

const navItems = [
  ['dashboard', '홈'],
  ['matches', '매칭'],
  ['calendar', '마감'],
  ['documents', '서류'],
  ['settings', '설정']
];

const categoryOptions = ['housing', 'savings', 'employment', 'living', 'transport', 'education'];
const employmentOptions = ['employed', 'job_seeker', 'freelancer', 'student', 'leaving_soon'];
const housingOptions = ['monthly_rent', 'jeonse', 'with_parents', 'moving_soon', 'own_home'];
const incomeOptions = ['under_2000', '2000_3000', '3000_4000', '4000_5000', '5000_6000', 'over_6000', 'unknown'];
const lifeEventOptions = ['first_job', 'moving_soon', 'leaving_job', 'marriage', 'none'];
const companyOptions = [
  ['small_medium', '중소기업'],
  ['mid_size', '중견기업'],
  ['large', '대기업'],
  ['public', '공공기관'],
  ['unknown', '잘 모르겠음']
];

function getResults() {
  return matchPolicies(POLICIES, state.profile);
}

function persistProfile() {
  writeStorage(PROFILE_KEY, state.profile);
}

function persistDocuments() {
  writeStorage(DOCUMENT_KEY, state.documentProgress);
}

function setView(view) {
  state.view = view;
  if (view !== 'detail') state.selectedPolicyId = null;
  render();
}

function selectPolicy(policyId) {
  state.selectedPolicyId = policyId;
  state.view = 'detail';
  render();
}

function resetAll() {
  removeStorage(PROFILE_KEY);
  removeStorage(DOCUMENT_KEY);
  state.profile = structuredClone(DEFAULT_PROFILE);
  state.documentProgress = [];
  state.view = 'dashboard';
  state.selectedPolicyId = null;
  render();
}

function h(value) {
  return escapeHtml(value ?? '');
}

function renderNav(className) {
  return `<nav class="${className}" aria-label="주요 메뉴">
    ${navItems.map(([key, label]) => `<button data-nav="${key}" class="${state.view === key ? 'nav-active' : ''}">${label}</button>`).join('')}
  </nav>`;
}

function renderShell(content) {
  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand-mark">YR</div>
        <div class="brand-text"><strong>청년혜택 레이더</strong><span>Codex CLI용 로컬 시제품</span></div>
        ${renderNav('top-nav')}
      </header>
      <div class="workspace">
        ${renderProfilePanel()}
        ${content}
      </div>
      ${renderNav('bottom-nav')}
    </div>
  `;
  bindCommonEvents();
}

function renderProfilePanel() {
  const profile = state.profile;
  return `
    <aside class="panel profile-panel">
      <div class="panel-header">
        <div><p class="eyebrow">내 조건</p><h2>3분 조건 입력</h2></div>
        <button class="ghost-button" data-reset>초기화</button>
      </div>

      <label>만 나이
        <input data-profile="age" type="number" min="18" max="45" value="${h(profile.age)}" />
      </label>

      <div class="field-grid two">
        <label>시/도
          <select data-profile="regionSido">
            ${['서울특별시', '경기도', '부산광역시', '대구광역시', '광주광역시', '대전광역시', '인천광역시'].map((item) => option(item, item, profile.regionSido)).join('')}
          </select>
        </label>
        <label>시/군/구
          <input data-profile="regionSigungu" value="${h(profile.regionSigungu)}" />
        </label>
      </div>

      <label>연소득 구간
        <select data-profile="incomeRange">
          ${incomeOptions.map((item) => option(item, INCOME_LABELS[item], profile.incomeRange)).join('')}
        </select>
      </label>

      <div class="field-grid two">
        <label>직장 상태
          <select data-profile="employmentStatus">
            ${employmentOptions.map((item) => option(item, EMPLOYMENT_LABELS[item], profile.employmentStatus)).join('')}
          </select>
        </label>
        <label>회사 유형
          <select data-profile="companyType">
            ${companyOptions.map(([value, label]) => option(value, label, profile.companyType)).join('')}
          </select>
        </label>
      </div>

      <label>주거 상태
        <select data-profile="housingStatus">
          ${housingOptions.map((item) => option(item, HOUSING_LABELS[item], profile.housingStatus)).join('')}
        </select>
      </label>

      <label>생애 이벤트
        <select data-profile="lifeEvent">
          ${lifeEventOptions.map((item) => option(item, LIFE_EVENT_LABELS[item], profile.lifeEvent)).join('')}
        </select>
      </label>

      <div class="chip-section">
        <span class="label-text">관심 분야</span>
        <div class="chip-list">
          ${categoryOptions.map((category) => `<button type="button" data-interest="${category}" class="chip ${profile.interests.includes(category) ? 'chip-active' : ''}">${CATEGORY_LABELS[category]}</button>`).join('')}
        </div>
      </div>

      <p class="privacy-note">주민등록번호, 상세주소, 회사명은 받지 않습니다. 현재 시제품은 localStorage에만 저장됩니다.</p>
    </aside>
  `;
}

function option(value, label, selected) {
  return `<option value="${h(value)}" ${value === selected ? 'selected' : ''}>${h(label)}</option>`;
}

function renderDashboard(results) {
  const likely = results.filter((result) => ['likely_eligible', 'needs_check'].includes(result.status));
  const topMatches = likely.slice(0, 3);
  const estimatedValue = topMatches.reduce((sum, result) => sum + result.policy.estimatedValue, 0);
  const urgent = results.filter((result) => ['urgent', 'soon'].includes(getDeadlineUrgency(result.policy))).slice(0, 3);
  const firstAction = urgent[0] ?? topMatches[0];
  const categories = ['housing', 'savings', 'living', 'transport', 'employment', 'education', 'entrepreneurship'];
  const categoryScores = categories.map((category) => {
    const scoped = results.filter((result) => result.policy.category === category);
    const score = scoped.length ? Math.round(scoped.reduce((sum, result) => sum + result.score, 0) / scoped.length) : 0;
    return { category, score };
  }).filter((item) => item.score > 0);

  return `
    <main class="content-stack">
      <section class="hero-card">
        <div>
          <p class="eyebrow">청년혜택 레이더</p>
          <h1>내 조건 기준, 지금 놓치면 아까운 혜택을 먼저 보여드립니다.</h1>
          <p>정책 검색이 아니라 신청 가능성, 마감, 서류를 한 화면에서 판단하는 로컬 시제품입니다.</p>
        </div>
        <div class="hero-metrics">
          <div><strong>${topMatches.length}개</strong><span>신청 가능성 높은 혜택</span></div>
          <div><strong>${formatMoney(estimatedValue)}</strong><span>입력 조건 기준 예상 최대 규모</span></div>
        </div>
      </section>

      ${firstAction ? `<section class="panel action-panel">
        <div><p class="eyebrow">오늘 할 일</p><h2>${h(firstAction.policy.title)}</h2><p>${getDeadlineLabel(firstAction.policy)} · 서류 ${firstAction.policy.requiredDocuments.length}개를 먼저 확인하세요.</p></div>
        <button class="primary-button" data-select-policy="${firstAction.policy.id}">지금 확인</button>
      </section>` : ''}

      <section class="dashboard-grid">
        <div class="panel">
          <div class="panel-header"><div><p class="eyebrow">혜택 레이더</p><h2>분야별 가능성</h2></div><button class="ghost-button" data-nav="matches">전체 보기</button></div>
          <div class="radar-list">
            ${categoryScores.map((item) => `<div class="radar-row"><span>${CATEGORY_LABELS[item.category]}</span><div class="radar-bar"><i style="width:${item.score}%"></i></div><strong>${item.score}</strong></div>`).join('')}
          </div>
        </div>
        <div class="panel">
          <div class="panel-header"><div><p class="eyebrow">마감 레이더</p><h2>가까운 마감</h2></div><button class="ghost-button" data-nav="calendar">마감 보기</button></div>
          <div class="deadline-list">
            ${urgent.length ? urgent.map((result) => `<button class="deadline-item" data-select-policy="${result.policy.id}"><strong>${getDeadlineLabel(result.policy)}</strong><span>${h(result.policy.title)}</span></button>`).join('') : '<p class="small-muted">이번 주 긴급 마감은 없습니다.</p>'}
          </div>
        </div>
      </section>

      <section class="section-block">
        <div class="section-title-row"><div><p class="eyebrow">Top 3</p><h2>지금 먼저 확인할 혜택</h2></div><button class="ghost-button" data-nav="matches">매칭 결과</button></div>
        <div class="card-grid">${topMatches.map(renderBenefitCard).join('')}</div>
      </section>

      <section class="dashboard-grid">
        ${renderDocumentProgressPanel(topMatches)}
        <div class="panel premium-card">
          <p class="eyebrow">Premium mock</p>
          <h2>월 3,900원으로 놓치지 않기</h2>
          <p>무제한 매칭, 마감 리마인더, 서류 체크, 정책 변경 요약을 프리미엄 가치로 검증합니다.</p>
          <div class="premium-price">3,900원 <span>/ 월</span></div>
          <p class="small-muted">예상 지원 규모는 확정 수령액이 아니며 실제 선정 여부는 기관 심사에 따라 달라집니다.</p>
        </div>
      </section>
    </main>
  `;
}

function renderDocumentProgressPanel(results) {
  const rows = results.map((result) => {
    const progress = state.documentProgress.find((item) => item.policyId === result.policy.id);
    const summary = getDocumentProgress(result.policy, progress);
    return `<div><div class="progress-top"><span>${h(result.policy.title)}</span><strong>${summary.percent}%</strong></div><div class="progress-bar"><i style="width:${summary.percent}%"></i></div><p class="small-muted">필수 서류 ${summary.completed}/${summary.total}개 완료</p></div>`;
  }).join('');
  return `<div class="panel"><div class="panel-header"><div><p class="eyebrow">서류 준비</p><h2>체크리스트 준비율</h2></div><button class="ghost-button" data-nav="documents">서류 보기</button></div><div class="doc-progress-list">${rows}</div></div>`;
}

function renderBenefitCard(result) {
  const policy = result.policy;
  const reasons = result.matchedReasons.slice(0, 2).map((reason) => `<li>✓ ${h(reason)}</li>`).join('');
  const checks = result.checkReasons.slice(0, 1).map((reason) => `<li>! ${h(reason)}</li>`).join('');
  return `
    <article class="benefit-card">
      <div class="card-topline"><span class="category-pill">${CATEGORY_LABELS[policy.category]}</span><span class="deadline-pill">${getDeadlineLabel(policy)}</span></div>
      <h3>${h(policy.title)}</h3>
      <p class="summary-text">${h(policy.summary)}</p>
      <div class="score-row"><div><span class="status-badge ${statusClassName(result.status)}">${STATUS_LABELS[result.status]}</span><p class="small-muted">신뢰도 ${result.confidence === 'high' ? '높음' : result.confidence === 'medium' ? '보통' : '낮음'}</p></div><div class="score-circle">${result.score}</div></div>
      <div class="meta-grid"><div><span>예상 혜택</span><strong>${h(policy.estimatedValueLabel)}</strong></div><div><span>마감</span><strong>${formatDate(policy.deadline.endDate)}</strong></div><div><span>서류</span><strong>${policy.requiredDocuments.length}개</strong></div></div>
      ${policy.isFinancialProduct ? '<p class="financial-note">정책금융 · 가입 권유 아님 · 공식 안내 확인 필요</p>' : ''}
      <div class="reason-box"><strong>왜 추천됐나요?</strong><ul>${reasons}${checks}</ul></div>
      <button class="primary-button full" data-select-policy="${policy.id}">상세 조건 보기</button>
    </article>
  `;
}

function renderMatches(results) {
  const tabs = [
    ['all', '전체'],
    ['likely_eligible', STATUS_LABELS.likely_eligible],
    ['needs_check', STATUS_LABELS.needs_check],
    ['not_eligible', STATUS_LABELS.not_eligible],
    ['closed', STATUS_LABELS.closed]
  ];
  const filtered = state.activeStatus === 'all' ? results : results.filter((result) => result.status === state.activeStatus);
  return `
    <main class="content-stack">
      <section class="section-title-row"><div><p class="eyebrow">혜택 매칭</p><h1>내 조건 기준 매칭 결과</h1><p class="small-muted">확정 판정이 아니라 입력 조건 기준의 신청 가능성 분류입니다.</p></div></section>
      <div class="tab-row">
        ${tabs.map(([key, label]) => {
          const count = key === 'all' ? results.length : results.filter((result) => result.status === key).length;
          return `<button class="tab ${state.activeStatus === key ? 'active' : ''}" data-status-tab="${key}">${label} <strong>${count}</strong></button>`;
        }).join('')}
      </div>
      <div class="card-grid">${filtered.map(renderBenefitCard).join('')}</div>
    </main>
  `;
}

function renderDetail(result) {
  const policy = result.policy;
  return `
    <main class="content-stack detail-page">
      <button class="ghost-button back-button" data-nav="matches">← 돌아가기</button>
      <section class="hero-card detail-hero">
        <div>
          <div class="card-topline"><span class="category-pill">${CATEGORY_LABELS[policy.category]}</span><span class="deadline-pill">${getDeadlineLabel(policy)}</span>${policy.isFinancialProduct ? '<span class="financial-chip">가입 권유 아님</span>' : ''}</div>
          <h1>${h(policy.title)}</h1>
          <p>${h(policy.summary)}</p>
        </div>
        <div class="detail-score"><span class="status-badge ${statusClassName(result.status)}">${STATUS_LABELS[result.status]}</span><strong>${result.score}점</strong><small>매칭 점수</small></div>
      </section>

      <section class="dashboard-grid">
        <div class="panel"><p class="eyebrow">내 조건과 비교</p><h2>조건 해석</h2><div class="evaluation-list">
          ${result.ruleEvaluations.map((evaluation) => `<div class="evaluation-item ${evaluation.status}"><strong>${evaluation.status === 'matched' ? '✓' : evaluation.status === 'needs_check' ? '!' : '×'} ${h(evaluation.plainText)}</strong><p>${h(evaluation.message)}</p></div>`).join('')}
        </div></div>
        <div class="panel"><p class="eyebrow">마감·지원규모</p><h2>신청 일정</h2><div class="info-list">
          <div><span>신청 기간</span><strong>${formatDate(policy.deadline.startDate)} ~ ${formatDate(policy.deadline.endDate)}</strong></div>
          <div><span>마감</span><strong>${getDeadlineLabel(policy)}</strong></div>
          <div><span>예상 혜택</span><strong>${h(policy.estimatedValueLabel)}</strong></div>
          <div><span>담당 기관</span><strong>${h(policy.provider)}</strong></div>
        </div></div>
      </section>

      <section class="panel"><div class="panel-header"><div><p class="eyebrow">서류</p><h2>제출서류 체크리스트</h2></div><button class="primary-button" data-nav="documents">서류 화면에서 체크</button></div>
        <div class="document-grid">${policy.requiredDocuments.map((document) => `<div class="document-card"><strong>${document.required ? '필수' : '선택'} · ${h(document.name)}</strong><p>발급처: ${h(document.issuer)}</p><p>${h(document.issueMethod)}</p>${document.memo ? `<small>${h(document.memo)}</small>` : ''}</div>`).join('')}</div>
      </section>

      <section class="panel trust-box"><p class="eyebrow">공식 확인</p><h2>${h(policy.sourceLabel)}</h2><p>${h(policy.cautionNote)}</p><p>이 결과는 사용자가 입력한 조건과 목업 정책 정보를 기준으로 한 사전 매칭입니다. 실제 신청 가능 여부와 지원금 지급 여부는 담당 기관의 심사 결과에 따라 달라질 수 있습니다.</p></section>
    </main>
  `;
}

function renderCalendar(results) {
  const ordered = [...results].sort((a, b) => (a.policy.deadline.endDate ?? '9999-12-31').localeCompare(b.policy.deadline.endDate ?? '9999-12-31'));
  return `
    <main class="content-stack">
      <section class="section-title-row"><div><p class="eyebrow">마감 캘린더</p><h1>이번 달 놓치면 아까운 혜택</h1><p class="small-muted">D-7, D-3 구간은 서류 준비를 우선 확인하세요.</p></div></section>
      <section class="panel timeline-panel">
        ${ordered.map((result) => {
          const urgency = getDeadlineUrgency(result.policy);
          return `<button class="timeline-item urgency-${urgency}" data-select-policy="${result.policy.id}"><div class="timeline-date"><strong>${getDeadlineLabel(result.policy)}</strong><span>${formatDate(result.policy.deadline.endDate)}</span></div><div><h3>${h(result.policy.title)}</h3><p>${CATEGORY_LABELS[result.policy.category]} · ${h(result.policy.provider)}</p></div><span class="timeline-score">${result.score}점</span></button>`;
        }).join('')}
      </section>
    </main>
  `;
}

function renderDocuments(results) {
  const topResults = results.filter((result) => ['likely_eligible', 'needs_check'].includes(result.status)).slice(0, 5);
  return `
    <main class="content-stack">
      <section class="section-title-row"><div><p class="eyebrow">제출서류</p><h1>신청 전 필요한 서류를 하나씩 체크하세요.</h1><p class="small-muted">실제 제출 서류는 공식 공고와 접수 화면에서 최종 확인해야 합니다.</p></div></section>
      <div class="document-policy-list">
        ${topResults.map((result) => {
          const policyProgress = state.documentProgress.find((item) => item.policyId === result.policy.id);
          const checked = new Set(policyProgress?.checkedDocumentIds ?? []);
          const summary = getDocumentProgress(result.policy, policyProgress);
          return `<section class="panel document-policy-card"><div class="panel-header"><div><p class="eyebrow">${summary.completed}/${summary.total} 완료</p><h2>${h(result.policy.title)}</h2></div><button class="ghost-button" data-select-policy="${result.policy.id}">상세</button></div><div class="progress-bar large"><i style="width:${summary.percent}%"></i></div><div class="checklist">
            ${result.policy.requiredDocuments.map((document) => `<label class="check-item"><input type="checkbox" data-doc-policy="${result.policy.id}" data-doc-id="${document.id}" ${checked.has(document.id) ? 'checked' : ''} /><span><strong>${h(document.name)}</strong><small>${h(document.issuer)} · ${h(document.issueMethod)}</small></span><em>${document.required ? '필수' : '선택'}</em></label>`).join('')}
          </div></section>`;
        }).join('')}
      </div>
    </main>
  `;
}

function renderSettings() {
  return `
    <main class="content-stack">
      <section class="section-title-row"><div><p class="eyebrow">설정</p><h1>개인정보와 신뢰 설정</h1></div></section>
      <section class="panel trust-box"><h2>시제품 개인정보 원칙</h2><ul><li>주민등록번호, 상세주소, 회사명, 계좌번호를 수집하지 않습니다.</li><li>조건 정보는 브라우저 localStorage에 저장됩니다.</li><li>모든 결과는 공식 판정이 아니라 사전 매칭입니다.</li></ul><button class="danger-button" data-reset>내 조건 초기화</button></section>
    </main>
  `;
}

function render() {
  const results = getResults();
  const selected = results.find((result) => result.policy.id === state.selectedPolicyId) ?? results[0];
  const content = state.view === 'matches'
    ? renderMatches(results)
    : state.view === 'calendar'
      ? renderCalendar(results)
      : state.view === 'documents'
        ? renderDocuments(results)
        : state.view === 'settings'
          ? renderSettings()
          : state.view === 'detail'
            ? renderDetail(selected)
            : renderDashboard(results);

  renderShell(content);
}

function bindCommonEvents() {
  document.querySelectorAll('[data-nav]').forEach((button) => {
    button.addEventListener('click', () => setView(button.dataset.nav));
  });

  document.querySelectorAll('[data-select-policy]').forEach((button) => {
    button.addEventListener('click', () => selectPolicy(button.dataset.selectPolicy));
  });

  document.querySelectorAll('[data-reset]').forEach((button) => {
    button.addEventListener('click', resetAll);
  });

  document.querySelectorAll('[data-status-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeStatus = button.dataset.statusTab;
      render();
    });
  });

  document.querySelectorAll('[data-profile]').forEach((input) => {
    input.addEventListener('change', () => {
      const key = input.dataset.profile;
      state.profile[key] = key === 'age' ? Number(input.value) : input.value;
      persistProfile();
      render();
    });
  });

  document.querySelectorAll('[data-interest]').forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.interest;
      const exists = state.profile.interests.includes(category);
      state.profile.interests = exists
        ? state.profile.interests.filter((item) => item !== category)
        : [...state.profile.interests, category];
      persistProfile();
      render();
    });
  });

  document.querySelectorAll('[data-doc-policy]').forEach((input) => {
    input.addEventListener('change', () => {
      const policyId = input.dataset.docPolicy;
      const documentId = input.dataset.docId;
      const existing = state.documentProgress.find((item) => item.policyId === policyId);
      if (!existing) {
        state.documentProgress.push({ policyId, checkedDocumentIds: [documentId] });
      } else if (existing.checkedDocumentIds.includes(documentId)) {
        existing.checkedDocumentIds = existing.checkedDocumentIds.filter((id) => id !== documentId);
      } else {
        existing.checkedDocumentIds.push(documentId);
      }
      persistDocuments();
      render();
    });
  });
}

render();
