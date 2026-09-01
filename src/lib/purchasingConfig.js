/* ══════════════════════════════════════════════════════════════
   Purchasing / Procurement module — shared config.
   Independent from suppliersConfig.js / recruitmentConfig.js on purpose:
   this module has its own Firestore collections (purchas...*) and its
   own role system (purchasingUsers), separate from the site's existing
   single-super-admin model.

   Simplified 3-role / 2-stage workflow (company restructure):
   Site Supervisor (creates) -> Site Engineer (reviews/signs) ->
   Procurement Manager (approves, then owns the full purchasing pipeline).
   Project Manager / Engineering Manager / General Manager / Store Keeper /
   Procurement Officer / Accountant / Viewer no longer participate.
   ══════════════════════════════════════════════════════════════ */

/* ─── Roles ─── */
export const ROLES = {
  SUPER_ADMIN:         'super_admin',
  SITE_SUPERVISOR:     'site_supervisor',
  SITE_ENGINEER:       'site_engineer',
  // Not a login role — no one authenticates as this. The requester captures
  // the Project Manager's name + signature as a second sign-off dialog during
  // submission (see purchase-request/page.js), same as the site engineer's
  // signature is captured on the same form. Exists here only so the activity
  // log / approvals record can attribute and label that signature correctly.
  PROJECT_MANAGER:     'project_manager',
  PROCUREMENT_MANAGER: 'procurement_manager',
};

export const ROLE_LABEL_KEYS = {
  [ROLES.SUPER_ADMIN]:         'purchasing.roleSuperAdmin',
  [ROLES.SITE_SUPERVISOR]:     'purchasing.roleSiteSupervisor',
  [ROLES.SITE_ENGINEER]:       'purchasing.roleSiteEngineer',
  [ROLES.PROJECT_MANAGER]:     'purchasing.roleProjectManager',
  [ROLES.PROCUREMENT_MANAGER]: 'purchasing.roleProcurementManager',
};

export const ALL_ROLES = Object.values(ROLES);

/* Roles allowed to open the /admin/purchasing module (dashboard shell) */
export const ADMIN_MODULE_ROLES = [ROLES.SUPER_ADMIN, ROLES.SITE_ENGINEER, ROLES.PROCUREMENT_MANAGER];

/* ─── Status enum ───
   Approval is the terminal decision step — no RFQ/PO/warehouse pipeline
   exists (removed per explicit request — "أوافق عليه وأطبعه وخلاص"). A
   lightweight delivery-confirmation loop sits after it though: once
   approved, the request's own submitter (not procurement, not a warehouse
   role) attaches a receipt photo and confirms delivery themselves, and only
   then does the procurement manager close the request out. */
export const STATUS = {
  PENDING_ENGINEER_APPROVAL: 'pending_site_engineer_approval',
  PENDING_PROC_APPROVAL:     'pending_procurement_approval',
  APPROVED:             'approved',
  RETURNED:             'returned_for_revision',
  REJECTED:             'rejected',
  RECEIVED:             'received',
  COMPLETED:            'completed',
};

/* Tabs shown in the main Purchasing Dashboard / requests list */
export const DASHBOARD_TABS = [
  STATUS.PENDING_ENGINEER_APPROVAL, STATUS.PENDING_PROC_APPROVAL,
  STATUS.APPROVED, STATUS.RECEIVED, STATUS.COMPLETED, STATUS.REJECTED, STATUS.RETURNED,
];

export const STATUS_COLORS = {
  [STATUS.PENDING_ENGINEER_APPROVAL]: '#3b82f6',
  [STATUS.PENDING_PROC_APPROVAL]: '#8b5cf6',
  [STATUS.APPROVED]:              '#10b981',
  [STATUS.RETURNED]:              '#f59e0b',
  [STATUS.REJECTED]:              '#ef4444',
  [STATUS.RECEIVED]:              '#84cc16',
  [STATUS.COMPLETED]:             '#6b7280',
};

export const STATUS_LABEL_KEYS = {
  [STATUS.PENDING_ENGINEER_APPROVAL]: 'purchasing.statusPendingEngineer',
  [STATUS.PENDING_PROC_APPROVAL]: 'purchasing.statusPendingProcurement',
  [STATUS.APPROVED]:              'purchasing.statusApproved',
  [STATUS.RETURNED]:              'purchasing.statusReturned',
  [STATUS.REJECTED]:              'purchasing.statusRejected',
  [STATUS.RECEIVED]:              'purchasing.statusReceived',
  [STATUS.COMPLETED]:             'purchasing.statusCompleted',
};

/* ─── Approval chain (fixed order, 2 stages, no conditional stage) ─── */
export const APPROVAL_STAGES = [
  { stage: 'site_engineer',       role: ROLES.SITE_ENGINEER,       status: STATUS.PENDING_ENGINEER_APPROVAL, next: STATUS.PENDING_PROC_APPROVAL },
  { stage: 'procurement_manager', role: ROLES.PROCUREMENT_MANAGER, status: STATUS.PENDING_PROC_APPROVAL,     next: STATUS.APPROVED },
];

/* ─── Priority ─── */
export const PRIORITY = { NORMAL: 'normal', URGENT: 'urgent', VERY_URGENT: 'very_urgent' };
export const PRIORITY_LABEL_KEYS = {
  [PRIORITY.NORMAL]:      'purchasing.priorityNormal',
  [PRIORITY.URGENT]:      'purchasing.priorityUrgent',
  [PRIORITY.VERY_URGENT]: 'purchasing.priorityVeryUrgent',
};
/* ─── Item categories ─── */
export const ITEM_CATEGORIES = [
  'civil_materials', 'electrical', 'plumbing', 'hvac', 'finishing', 'paint',
  'carpentry', 'safety_equipment', 'machinery_rental', 'fuel', 'office_supplies', 'other',
];
export const ITEM_CATEGORY_LABEL_KEYS = Object.fromEntries(
  ITEM_CATEGORIES.map(c => [c, `purchasing.category_${c}`])
);

/* ─── Allowed attachment types ─── */
export const ACCEPTED_ATTACHMENT_EXT = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.dwg', '.dxf',
  '.zip', '.png', '.jpg', '.jpeg', '.webp',
];
export const ACCEPTED_ATTACHMENT_ACCEPT = ACCEPTED_ATTACHMENT_EXT.join(',');
export const MAX_ATTACHMENT_SIZE_MB = 25;
