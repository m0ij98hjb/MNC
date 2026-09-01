/* ══════════════════════════════════════════════════════════════
   Project Budget Control — connects purchaseRequests to a lightweight
   per-project budget registry (projectBudgets). No real "Projects+budget"
   module exists elsewhere on the site (Projects is marketing content only,
   see docs/purchasing/Roles.md deviations) — this registry is purpose-built
   for procurement.
   Approval is the terminal step (no RFQ/PO/delivery pipeline past it), so
   there's no separate "actual vs. committed" spend — an approved or still-
   pending request's estimated cost IS what counts against the budget.
   ══════════════════════════════════════════════════════════════ */
import { STATUS } from './purchasingConfig';

export function projectKeyFor(projectName) {
  return (projectName || '').trim().toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, '-').replace(/^-+|-+$/g, '') || 'unassigned';
}

/* Requests whose estimated cost counts against the budget (not rejected/returned) */
const SPENT_STATUSES = [STATUS.PENDING_ENGINEER_APPROVAL, STATUS.PENDING_PROC_APPROVAL, STATUS.APPROVED];

export function computeBudgetSummary({ approvedBudget, projectRequests }) {
  const committedCost = (projectRequests || [])
    .filter(r => SPENT_STATUSES.includes(r.status))
    .reduce((sum, r) => sum + (Number(r.totalEstimatedCost) || 0), 0);

  const budget = Number(approvedBudget) || 0;
  const remaining = budget - committedCost;
  const consumedPct = budget > 0 ? Math.min(999, Math.round((committedCost / budget) * 100)) : 0;

  return { approvedBudget: budget, committedCost, remaining, consumedPct, exceeded: budget > 0 && remaining < 0 };
}

export function budgetBarColor(consumedPct) {
  if (consumedPct >= 100) return '#ef4444';
  if (consumedPct >= 80) return '#f59e0b';
  return '#10b981';
}
