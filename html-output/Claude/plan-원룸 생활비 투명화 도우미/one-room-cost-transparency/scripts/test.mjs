import assert from 'node:assert/strict';
import { roomCandidates } from '../src/data/mockRooms.js';
import { getCostSummary, getDepositOpportunityCost } from '../src/engines/costEngine.js';
import { getRiskSignals, getTransparencyScore } from '../src/engines/riskEngine.js';
import { getChecklistForRoom } from '../src/engines/checklistEngine.js';
import { getMoveOutSettlement } from '../src/engines/settlementEngine.js';

const room = roomCandidates[0];
const summary = getCostSummary(room);
assert.equal(getDepositOpportunityCost(12000000, 0.03), 30000);
assert.ok(summary.normal.total > room.monthlyRent, 'real monthly cost should exceed advertised rent');
assert.ok(summary.winter.total > summary.normal.total, 'winter should be more expensive for city gas room');
assert.ok(getTransparencyScore(room) >= 0 && getTransparencyScore(room) <= 100);
assert.ok(getRiskSignals(room).length >= 1, 'sample room should have risk signals');
assert.ok(getChecklistForRoom(room).length >= 5, 'checklist should be generated');
assert.ok(getMoveOutSettlement(room).finalReturnAmount < room.deposit, 'move-out settlement should deduct costs');
console.log('Tests passed: cost, risk, checklist, settlement engines.');
