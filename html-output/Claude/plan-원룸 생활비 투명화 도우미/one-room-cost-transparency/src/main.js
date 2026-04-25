import { roomCandidates, maintenanceLabels, seasonLabels, monthlyBills } from './data/mockRooms.js';
import {
  cloneRoom,
  formatMoney,
  getCostBreakdown,
  getCostSummary,
  getDepositOpportunityCost,
  getMonthlyWave,
  getSeasonalCost,
  numberOrZero
} from './engines/costEngine.js';
import { getRiskSignals, getTransparencyScore, getTransparencyStatus } from './engines/riskEngine.js';
import { getChecklistForRoom } from './engines/checklistEngine.js';
import { getMoveOutSettlement } from './engines/settlementEngine.js';

const storageKey = 'one-room-cost-transparency:v0.1';
const app = document.querySelector('#app');

const defaultState = {
  currentRoomId: 'room-a',
  rooms: roomCandidates.map(cloneRoom),
  activeTab: 'home',
  checkedItems: {},
  settlementOverrides: {}
};

let state = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return structuredClone(defaultState);
    const parsed = JSON.parse(saved);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      rooms: parsed.rooms?.length ? parsed.rooms : roomCandidates.map(cloneRoom)
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function setState(patch) {
  state = { ...state, ...patch };
  saveState();
  render();
}

function getCurrentRoom() {
  return state.rooms.find((room) => room.id === state.currentRoomId) ?? state.rooms[0];
}

function updateCurrentRoom(patch) {
  const room = getCurrentRoom();
  const nextRooms = state.rooms.map((candidate) =>
    candidate.id === room.id ? { ...candidate, ...patch } : candidate
  );
  setState({ rooms: nextRooms });
}

function updateCurrentRoomDeep(path, value) {
  const room = cloneRoom(getCurrentRoom());
  let cursor = room;
  path.slice(0, -1).forEach((key) => {
    if (!cursor[key]) cursor[key] = {};
    cursor = cursor[key];
  });
  cursor[path[path.length - 1]] = value;
  const nextRooms = state.rooms.map((candidate) => (candidate.id === room.id ? room : candidate));
  setState({ rooms: nextRooms });
}

function resetData() {
  localStorage.removeItem(storageKey);
  state = structuredClone(defaultState);
  render();
}

function classForTone(tone) {
  return {
    success: 'tone-success',
    warning: 'tone-warning',
    danger: 'tone-danger',
    info: 'tone-info',
    muted: 'tone-muted'
  }[tone] ?? 'tone-muted';
}

function getSeverityTone(severity) {
  if (severity === 'danger') return 'danger';
  if (severity === 'warning') return 'warning';
  return 'info';
}

function progressBar(percent, tone = 'info') {
  return `<div class="progress"><span class="${classForTone(tone)}" style="width:${Math.max(3, Math.min(100, percent))}%"></span></div>`;
}

function moneyInput(label, value, onInputName, help = '') {
  return `
    <label class="field">
      <span>${label}</span>
      <input inputmode="numeric" data-input="${onInputName}" value="${value}" />
      ${help ? `<small>${help}</small>` : ''}
    </label>
  `;
}

function selectInput(label, value, onInputName, options) {
  return `
    <label class="field">
      <span>${label}</span>
      <select data-input="${onInputName}">
        ${options.map((option) => `<option value="${option.value}" ${option.value === value ? 'selected' : ''}>${option.label}</option>`).join('')}
      </select>
    </label>
  `;
}

function renderHeader(room) {
  return `
    <header class="hero">
      <div>
        <p class="eyebrow">Local-first prototype · v0.1</p>
        <h1>원룸 생활비 투명화 도우미</h1>
        <p class="hero-copy">월세, 관리비, 공과금, 보증금 기회비용까지 합쳐 계약 전 실제 월 부담액을 보여줍니다.</p>
      </div>
      <div class="hero-panel">
        <label class="field slim">
          <span>비교 중인 방</span>
          <select data-action="switch-room">
            ${state.rooms.map((candidate) => `<option value="${candidate.id}" ${candidate.id === room.id ? 'selected' : ''}>${candidate.name}</option>`).join('')}
          </select>
        </label>
        <button class="ghost-button" data-action="reset-data">초기화</button>
      </div>
    </header>
  `;
}

function renderTabs() {
  const tabs = [
    ['home', '홈'],
    ['breakdown', '해부도'],
    ['compare', '비교'],
    ['checklist', '체크'],
    ['moveout', '정산']
  ];

  return `
    <nav class="tabs" aria-label="주요 화면">
      ${tabs.map(([id, label]) => `<button class="tab ${state.activeTab === id ? 'active' : ''}" data-tab="${id}">${label}</button>`).join('')}
    </nav>
  `;
}

function renderQuickEditor(room) {
  return `
    <section class="card editor-card">
      <div class="section-title">
        <div>
          <p class="eyebrow">3분 입력</p>
          <h2>방 비용 조건</h2>
        </div>
        <span class="pill tone-info">로컬 저장</span>
      </div>
      <div class="grid form-grid">
        ${moneyInput('보증금', room.deposit, 'deposit', '보증금 기회비용 계산에 사용됩니다.')}
        ${moneyInput('월세', room.monthlyRent, 'monthlyRent')}
        ${moneyInput('관리비', room.maintenanceFee, 'maintenanceFee')}
        ${moneyInput('전기 평상시', room.utilities.electricity.normal, 'electricity.normal')}
        ${moneyInput('전기 여름', room.utilities.electricity.summer, 'electricity.summer')}
        ${moneyInput('가스 겨울', room.utilities.gas.winter, 'gas.winter')}
      </div>
      <div class="toggle-row">
        <label><input type="checkbox" data-toggle="electricityMeterConfirmed" ${room.electricityMeterConfirmed ? 'checked' : ''}/> 전기 단독 계량기 확인</label>
        <label><input type="checkbox" data-toggle="contractTerms.maintenanceWritten" ${room.contractTerms?.maintenanceWritten ? 'checked' : ''}/> 관리비 계약서 기재</label>
        <label><input type="checkbox" data-toggle="contractTerms.cleaningFeeConfirmed" ${room.contractTerms?.cleaningFeeConfirmed ? 'checked' : ''}/> 퇴실 청소비 기준 확인</label>
      </div>
    </section>
  `;
}

function renderHome(room) {
  const summary = getCostSummary(room);
  const score = getTransparencyScore(room);
  const status = getTransparencyStatus(score);
  const risks = getRiskSignals(room);
  const normal = summary.normal;

  return `
    <main class="layout">
      <div class="main-column">
        <section class="card highlight-card">
          <p class="eyebrow">이 방의 진짜 월 주거비</p>
          <div class="big-number">${formatMoney(normal.total)}</div>
          <p class="muted">광고 월세 ${formatMoney(summary.advertisedRent)}보다 <strong>${formatMoney(summary.hiddenMonthlyGap)}</strong> 더 볼 필요가 있어요.</p>
          <div class="season-grid">
            <div><span>평상시</span><strong>${formatMoney(summary.normal.total)}</strong></div>
            <div><span>여름 예상</span><strong>${formatMoney(summary.summer.total)}</strong></div>
            <div><span>겨울 예상</span><strong>${formatMoney(summary.winter.total)}</strong></div>
          </div>
          <div class="notice">실제 청구액이 아니라, 입력값 기반의 계약 전 참고 추정입니다.</div>
        </section>

        <section class="card">
          <div class="section-title">
            <div>
              <p class="eyebrow">비용 투명도</p>
              <h2>${score}점 · ${status.label}</h2>
            </div>
            <span class="pill ${classForTone(status.tone)}">${status.label}</span>
          </div>
          ${progressBar(score, status.tone)}
          <p class="muted">관리비 항목, 전기·가스 납부 방식, 퇴실 정산 기준이 명확할수록 점수가 올라갑니다.</p>
        </section>

        <section class="card">
          <div class="section-title">
            <div>
              <p class="eyebrow">계약 전 확인</p>
              <h2>꼭 물어볼 질문 ${Math.min(risks.length, 3)}개</h2>
            </div>
            <button class="link-button" data-tab="checklist">전체 체크리스트</button>
          </div>
          <div class="risk-list">
            ${risks.slice(0, 3).map((risk) => `
              <article class="risk-item ${classForTone(getSeverityTone(risk.severity))}">
                <strong>${risk.title}</strong>
                <p>${risk.description}</p>
                <code>${risk.recommendedQuestion}</code>
              </article>
            `).join('')}
          </div>
        </section>
      </div>
      <aside class="side-column">
        ${renderQuickEditor(room)}
        ${renderMaintenanceSummary(room)}
      </aside>
    </main>
  `;
}

function renderMaintenanceSummary(room) {
  const included = Object.entries(room.maintenanceItems ?? {}).filter(([, value]) => value === true);
  const excluded = Object.entries(room.maintenanceItems ?? {}).filter(([, value]) => value === false);
  const unknown = Object.entries(room.maintenanceItems ?? {}).filter(([, value]) => value === 'unknown');

  const list = (items, cls) => items.length
    ? items.map(([key]) => `<span class="chip ${cls}">${maintenanceLabels[key] ?? key}</span>`).join('')
    : '<span class="muted">없음</span>';

  return `
    <section class="card">
      <p class="eyebrow">관리비 해부도</p>
      <h2>${formatMoney(room.maintenanceFee)}</h2>
      <div class="chip-group"><strong>포함</strong>${list(included, 'good')}</div>
      <div class="chip-group"><strong>미포함</strong>${list(excluded, 'bad')}</div>
      <div class="chip-group"><strong>확인 필요</strong>${list(unknown, 'warn')}</div>
    </section>
  `;
}

function renderBreakdown(room) {
  const summary = getCostSummary(room);
  const breakdown = getCostBreakdown(room, 'normal');
  const wave = getMonthlyWave(room);
  const maxWave = Math.max(...wave.map((item) => item.cost));

  return `
    <main class="layout">
      <div class="main-column">
        <section class="card">
          <div class="section-title">
            <div>
              <p class="eyebrow">진짜 월세 게이지</p>
              <h2>광고 월세와 실제 부담액의 차이</h2>
            </div>
            <span class="pill tone-warning">+${formatMoney(summary.hiddenMonthlyGap)}</span>
          </div>
          <div class="rent-gauge">
            <div>
              <span>광고 월세</span>
              <strong>${formatMoney(summary.advertisedRent)}</strong>
            </div>
            <div>
              <span>진짜 월 주거비</span>
              <strong>${formatMoney(summary.normal.total)}</strong>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="section-title">
            <div>
              <p class="eyebrow">생활비 해부도</p>
              <h2>총액 ${formatMoney(summary.normal.total)}</h2>
            </div>
          </div>
          <div class="breakdown-list">
            ${breakdown.map((item) => `
              <div class="breakdown-row">
                <div>
                  <strong>${item.label}</strong>
                  <span>${item.percent}%</span>
                </div>
                <b>${formatMoney(item.amount)}</b>
                ${progressBar(item.percent, item.type === 'hidden' ? 'warning' : 'info')}
              </div>
            `).join('')}
          </div>
        </section>

        <section class="card">
          <p class="eyebrow">계절별 비용 파도</p>
          <h2>1년 동안 비용이 얼마나 흔들릴까요?</h2>
          <div class="wave-chart">
            ${wave.map((item) => `
              <div class="wave-row">
                <span>${item.month}</span>
                <div class="bar"><i style="width:${Math.round((item.cost / maxWave) * 100)}%"></i></div>
                <strong>${formatMoney(item.cost)}</strong>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
      <aside class="side-column">
        <section class="card">
          <p class="eyebrow">보증금 기회비용</p>
          <h2>${formatMoney(getDepositOpportunityCost(room.deposit, room.opportunityRate))}/월</h2>
          <p class="muted">보증금 ${formatMoney(room.deposit)}이 묶이는 비용을 연 ${(room.opportunityRate * 100).toFixed(1)}% 기준으로 단순 환산했습니다.</p>
        </section>
        ${renderSeasonSimulator(room)}
      </aside>
    </main>
  `;
}

function renderSeasonSimulator(room) {
  const normal = getSeasonalCost(room, 'normal');
  const summer = getSeasonalCost(room, 'summer');
  const winter = getSeasonalCost(room, 'winter');
  const rows = [normal, summer, winter];

  return `
    <section class="card">
      <p class="eyebrow">공과금 계절 시뮬레이터</p>
      <h2>평상시 대비 변동</h2>
      <div class="season-list">
        ${rows.map((row) => `
          <div class="season-item">
            <span>${seasonLabels[row.season]}</span>
            <strong>${formatMoney(row.total)}</strong>
            <small>${row.total >= normal.total ? '+' : ''}${formatMoney(row.total - normal.total)}</small>
          </div>
        `).join('')}
      </div>
      <p class="muted">정확한 요금 예측이 아니라, 계절별 비용 흔들림을 보기 위한 참고 시뮬레이션입니다.</p>
    </section>
  `;
}

function renderCompare() {
  const rows = state.rooms.map((room) => {
    const summary = getCostSummary(room);
    const score = getTransparencyScore(room);
    const status = getTransparencyStatus(score);
    return { room, summary, score, status };
  }).sort((a, b) => {
    const aRank = a.summary.winter.total - a.score * 1500;
    const bRank = b.summary.winter.total - b.score * 1500;
    return aRank - bRank;
  });

  const best = rows[0];

  return `
    <main class="single-column">
      <section class="card">
        <div class="section-title">
          <div>
            <p class="eyebrow">방 후보 비교</p>
            <h2>월세가 아니라 총액 기준으로 비교</h2>
          </div>
          <span class="pill tone-success">추천: ${best.room.name}</span>
        </div>
        <div class="compare-table-wrapper">
          <table class="compare-table">
            <thead>
              <tr>
                <th>항목</th>
                ${rows.map(({ room }) => `<th>${room.name}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr><td>월세</td>${rows.map(({ room }) => `<td>${formatMoney(room.monthlyRent)}</td>`).join('')}</tr>
              <tr><td>관리비</td>${rows.map(({ room }) => `<td>${formatMoney(room.maintenanceFee)}</td>`).join('')}</tr>
              <tr><td>평상시 총액</td>${rows.map(({ summary }) => `<td><strong>${formatMoney(summary.normal.total)}</strong></td>`).join('')}</tr>
              <tr><td>여름 총액</td>${rows.map(({ summary }) => `<td>${formatMoney(summary.summer.total)}</td>`).join('')}</tr>
              <tr><td>겨울 총액</td>${rows.map(({ summary }) => `<td>${formatMoney(summary.winter.total)}</td>`).join('')}</tr>
              <tr><td>투명도</td>${rows.map(({ score, status }) => `<td><span class="pill ${classForTone(status.tone)}">${score}점</span></td>`).join('')}</tr>
              <tr><td>확인 질문</td>${rows.map(({ room }) => `<td>${getRiskSignals(room).length}개</td>`).join('')}</tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="grid three-grid">
        ${rows.map(({ room, summary, score, status }, index) => `
          <article class="card candidate-card ${index === 0 ? 'best' : ''}">
            <p class="eyebrow">${index + 1}위</p>
            <h3>${room.name}</h3>
            <p class="muted">${room.region} · ${room.areaPyeong}평 · ${room.housingType}</p>
            <div class="candidate-metric"><span>평상시</span><strong>${formatMoney(summary.normal.total)}</strong></div>
            <div class="candidate-metric"><span>겨울</span><strong>${formatMoney(summary.winter.total)}</strong></div>
            <div class="candidate-metric"><span>투명도</span><strong>${score}점 · ${status.label}</strong></div>
            <button data-action="choose-room" data-room-id="${room.id}" class="secondary-button">이 방으로 보기</button>
          </article>
        `).join('')}
      </section>
    </main>
  `;
}

function renderChecklist(room) {
  const items = getChecklistForRoom(room);
  const checkedMap = state.checkedItems[room.id] ?? {};
  const done = items.filter((item) => checkedMap[item.id]).length;

  return `
    <main class="layout">
      <div class="main-column">
        <section class="card">
          <div class="section-title">
            <div>
              <p class="eyebrow">계약 전 질문 체크리스트</p>
              <h2>${done}/${items.length}개 확인 완료</h2>
            </div>
            <span class="pill tone-info">질문 복사용</span>
          </div>
          ${progressBar((done / items.length) * 100, 'success')}
          <div class="checklist">
            ${items.map((item) => `
              <label class="check-item ${item.priority === 'high' ? 'priority' : ''}">
                <input type="checkbox" data-checklist-id="${item.id}" ${checkedMap[item.id] ? 'checked' : ''}/>
                <div>
                  <strong>${item.title}</strong>
                  <p>${item.question}</p>
                  <small>${item.category} · ${item.reason}</small>
                </div>
              </label>
            `).join('')}
          </div>
        </section>
      </div>
      <aside class="side-column">
        <section class="card">
          <p class="eyebrow">복사해서 물어보기</p>
          <h2>중개사·임대인 질문</h2>
          <textarea readonly rows="12">${items.filter((item) => item.priority === 'high').map((item, index) => `${index + 1}. ${item.question}`).join('\n')}</textarea>
          <button class="primary-button" data-action="copy-questions">질문 복사</button>
        </section>
      </aside>
    </main>
  `;
}

function renderMoveOut(room) {
  const settlement = getMoveOutSettlement(room, state.settlementOverrides[room.id] ?? {});

  return `
    <main class="layout">
      <div class="main-column">
        <section class="card highlight-card">
          <p class="eyebrow">퇴실 정산 예상</p>
          <div class="big-number">${formatMoney(settlement.finalReturnAmount)}</div>
          <p class="muted">보증금 ${formatMoney(settlement.deposit)}에서 예상 차감 ${formatMoney(settlement.deductions)}을 반영한 참고 금액입니다.</p>
          <div class="notice">계약서·고지서·임대인 확인 전에는 확정 금액으로 보지 마세요.</div>
        </section>

        <section class="card">
          <p class="eyebrow">차감 가능 항목</p>
          <h2>보증금에서 빠질 수 있는 비용</h2>
          <div class="deduction-list">
            ${settlement.items.map((item) => `
              <div class="deduction-row">
                <div>
                  <strong>${item.label}</strong>
                  <span>${item.confirmed ? '계약서 기준 확인됨' : '추가 확인 필요'}</span>
                </div>
                <b>${formatMoney(item.amount)}</b>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
      <aside class="side-column">
        <section class="card">
          <p class="eyebrow">정산 값 조정</p>
          <h2>퇴실 전에 미리 계산</h2>
          <label class="field"><span>청소비</span><input data-settlement="cleaningFee" inputmode="numeric" value="${settlement.items.find((item) => item.label === '퇴실 청소비')?.amount ?? 0}" /></label>
          <label class="field"><span>수리비</span><input data-settlement="repairFee" inputmode="numeric" value="${settlement.items.find((item) => item.label === '수리비')?.amount ?? 0}" /></label>
          <label class="field"><span>마지막 공과금</span><input data-settlement="unpaidUtility" inputmode="numeric" value="${settlement.items.find((item) => item.label === '마지막 공과금')?.amount ?? 0}" /></label>
        </section>
        <section class="card">
          <p class="eyebrow">월별 고지서 기록</p>
          <h2>최근 기록</h2>
          ${monthlyBills.slice(-3).map((bill) => {
            const total = bill.rent + bill.maintenance + bill.electricity + bill.gas + bill.water + bill.other;
            return `<div class="bill-row"><span>${bill.month}</span><strong>${formatMoney(total)}</strong></div>`;
          }).join('')}
        </section>
      </aside>
    </main>
  `;
}

function render() {
  const room = getCurrentRoom();
  const content = {
    home: () => renderHome(room),
    breakdown: () => renderBreakdown(room),
    compare: () => renderCompare(room),
    checklist: () => renderChecklist(room),
    moveout: () => renderMoveOut(room)
  }[state.activeTab]?.() ?? renderHome(room);

  app.innerHTML = `
    <div class="app-shell">
      ${renderHeader(room)}
      ${renderTabs()}
      ${content}
      <footer class="footer-note">
        <strong>신뢰 안내</strong> 이 시제품은 입력값 기반 참고 계산입니다. 실제 관리비, 공과금, 보증금 정산, 계약 조건은 계약서와 공식 고지서, 임대인·중개사 확인 내용에 따라 달라질 수 있습니다.
      </footer>
    </div>
  `;
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll('[data-tab]').forEach((element) => {
    element.addEventListener('click', () => setState({ activeTab: element.dataset.tab }));
  });

  document.querySelector('[data-action="reset-data"]')?.addEventListener('click', resetData);

  document.querySelector('[data-action="switch-room"]')?.addEventListener('change', (event) => {
    setState({ currentRoomId: event.target.value });
  });

  document.querySelectorAll('[data-action="choose-room"]').forEach((button) => {
    button.addEventListener('click', () => setState({ currentRoomId: button.dataset.roomId, activeTab: 'home' }));
  });

  document.querySelectorAll('[data-input]').forEach((input) => {
    input.addEventListener('change', (event) => {
      const key = input.dataset.input;
      const rawValue = event.target.value.replace(/,/g, '');
      if (key.includes('.')) {
        const [utility, field] = key.split('.');
        updateCurrentRoomDeep(['utilities', utility, field], numberOrZero(rawValue));
      } else {
        updateCurrentRoom({ [key]: numberOrZero(rawValue) });
      }
    });
  });

  document.querySelectorAll('[data-toggle]').forEach((input) => {
    input.addEventListener('change', () => {
      const path = input.dataset.toggle.split('.');
      if (path.length > 1) updateCurrentRoomDeep(path, input.checked);
      else updateCurrentRoom({ [input.dataset.toggle]: input.checked });
    });
  });

  document.querySelectorAll('[data-checklist-id]').forEach((input) => {
    input.addEventListener('change', () => {
      const room = getCurrentRoom();
      const checkedItems = structuredClone(state.checkedItems);
      checkedItems[room.id] = { ...(checkedItems[room.id] ?? {}), [input.dataset.checklistId]: input.checked };
      setState({ checkedItems });
    });
  });

  document.querySelectorAll('[data-settlement]').forEach((input) => {
    input.addEventListener('change', (event) => {
      const room = getCurrentRoom();
      const settlementOverrides = structuredClone(state.settlementOverrides);
      settlementOverrides[room.id] = {
        ...(settlementOverrides[room.id] ?? {}),
        [input.dataset.settlement]: numberOrZero(event.target.value.replace(/,/g, ''))
      };
      setState({ settlementOverrides });
    });
  });

  document.querySelector('[data-action="copy-questions"]')?.addEventListener('click', async () => {
    const text = document.querySelector('textarea')?.value ?? '';
    try {
      await navigator.clipboard.writeText(text);
      window.alert('질문을 복사했습니다.');
    } catch {
      window.alert('복사 권한이 없어 텍스트를 직접 선택해 복사해주세요.');
    }
  });
}

render();
