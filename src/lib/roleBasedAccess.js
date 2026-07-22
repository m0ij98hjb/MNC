/* ══════════════════════════════════════════════════════════════
   Role-Based Access Control (RBAC) - Central Configuration
   ══════════════════════════════════════════════════════════════ */

/* ─── Roles Definition ─── */
export const ROLES = {
  // Management
  COMPANY_MANAGER: 'company_manager',
  PROJECT_MANAGER: 'project_manager',
  PROCUREMENT_MANAGER: 'procurement_manager',
  HR_MANAGER: 'hr_manager',
  ACCOUNTANT: 'accountant',
  ENGINEERING_MANAGER: 'engineering_manager',
  
  // Site & Engineering
  SITE_ENGINEER: 'site_engineer',
  SITE_SUPERVISOR: 'site_supervisor',
  
  // External
  SUPPLIER: 'supplier',
  CLIENT: 'client',
  
  // System
  SUPER_ADMIN: 'super_admin',
};

/* ─── Role Labels (Arabic) ─── */
export const ROLE_LABELS = {
  [ROLES.COMPANY_MANAGER]: 'مدير الشركة',
  [ROLES.PROJECT_MANAGER]: 'مدير المشاريع',
  [ROLES.PROCUREMENT_MANAGER]: 'مدير المشتريات',
  [ROLES.HR_MANAGER]: 'مدير الموارد البشرية',
  [ROLES.ACCOUNTANT]: 'المحاسب',
  [ROLES.ENGINEERING_MANAGER]: 'مدير الهندسة',
  [ROLES.SITE_ENGINEER]: 'مهندس موقع',
  [ROLES.SITE_SUPERVISOR]: 'مشرف موقع',
  [ROLES.SUPPLIER]: 'المورد',
  [ROLES.CLIENT]: 'العميل',
  [ROLES.SUPER_ADMIN]: 'مدير النظام',
};

/* ─── Dashboard Routes per Role ─── */
export const ROLE_DASHBOARDS = {
  [ROLES.COMPANY_MANAGER]: '/admin/dashboard',
  [ROLES.PROJECT_MANAGER]: '/admin/dashboard',
  [ROLES.PROCUREMENT_MANAGER]: '/admin/purchasing',
  [ROLES.HR_MANAGER]: '/admin/jobs',
  [ROLES.ACCOUNTANT]: '/admin/reports',
  [ROLES.ENGINEERING_MANAGER]: '/admin/dashboard',
  [ROLES.SITE_ENGINEER]: '/admin/purchasing',
  [ROLES.SITE_SUPERVISOR]: '/purchase-request',
  [ROLES.SUPPLIER]: '/admin/suppliers',
  [ROLES.CLIENT]: '/admin/dashboard',
  [ROLES.SUPER_ADMIN]: '/admin/dashboard',
};

/* ─── Navigation Items per Role ─── */
export const ROLE_NAVIGATION = {
  [ROLES.COMPANY_MANAGER]: [
    { href: '/admin/dashboard', label: 'لوحة التحكم', icon: 'LayoutDashboard' },
    { href: '/admin/suppliers', label: 'الموردون', icon: 'Users' },
    { href: '/admin/jobs', label: 'طلبات التوظيف', icon: 'Briefcase' },
    { href: '/admin/messages', label: 'رسائل العملاء', icon: 'MessageSquare' },
    { href: '/admin/approved', label: 'المقبولون', icon: 'CheckCircle' },
    { href: '/admin/purchasing', label: 'إدارة المشتريات', icon: 'ShoppingCart' },
    { href: '/admin/reports', label: 'التقارير', icon: 'BarChart2' },
  ],
  
  [ROLES.PROJECT_MANAGER]: [
    { href: '/admin/dashboard', label: 'لوحة التحكم', icon: 'LayoutDashboard' },
    { href: '/admin/suppliers', label: 'الموردون', icon: 'Users' },
    { href: '/admin/jobs', label: 'طلبات التوظيف', icon: 'Briefcase' },
    { href: '/admin/purchasing', label: 'إدارة المشتريات', icon: 'ShoppingCart' },
    { href: '/admin/reports', label: 'التقارير', icon: 'BarChart2' },
  ],
  
  [ROLES.PROCUREMENT_MANAGER]: [
    { href: '/admin/dashboard', label: 'لوحة التحكم', icon: 'LayoutDashboard' },
    { href: '/admin/purchasing', label: 'إدارة المشتريات', icon: 'ShoppingCart' },
    { href: '/admin/purchasing/requests', label: 'طلبات الشراء', icon: 'ShoppingCart' },
    { href: '/admin/purchasing/orders', label: 'أوامر الشراء', icon: 'ShoppingCart' },
    { href: '/admin/purchasing/suppliers', label: 'الموردين', icon: 'Users' },
    { href: '/admin/purchasing/rfq', label: 'المقارنات', icon: 'BarChart2' },
    { href: '/admin/purchasing/reports', label: 'التقارير', icon: 'BarChart2' },
    { href: '/admin/purchasing/settings', label: 'الإعدادات', icon: 'Settings' },
  ],
  
  [ROLES.HR_MANAGER]: [
    { href: '/admin/dashboard', label: 'لوحة التحكم', icon: 'LayoutDashboard' },
    { href: '/admin/jobs', label: 'طلبات التوظيف', icon: 'Briefcase' },
    { href: '/admin/jobs/approved', label: 'المقبولون للمقابلة', icon: 'CheckCircle' },
    { href: '/admin/jobs/best', label: 'أفضل المرشحين', icon: 'Award' },
    { href: '/admin/reports', label: 'التقارير', icon: 'BarChart2' },
  ],
  
  [ROLES.ACCOUNTANT]: [
    { href: '/admin/dashboard', label: 'لوحة التحكم', icon: 'LayoutDashboard' },
    { href: '/admin/purchasing', label: 'إدارة المشتريات', icon: 'ShoppingCart' },
    { href: '/admin/purchasing/orders', label: 'أوامر الشراء', icon: 'ShoppingCart' },
    { href: '/admin/purchasing/reports', label: 'التقارير المالية', icon: 'BarChart2' },
    { href: '/admin/reports', label: 'التقارير العامة', icon: 'BarChart2' },
  ],
  
  [ROLES.ENGINEERING_MANAGER]: [
    { href: '/admin/dashboard', label: 'لوحة التحكم', icon: 'LayoutDashboard' },
    { href: '/admin/suppliers', label: 'الموردون', icon: 'Users' },
    { href: '/admin/purchasing', label: 'إدارة المشتريات', icon: 'ShoppingCart' },
    { href: '/admin/reports', label: 'التقارير', icon: 'BarChart2' },
  ],
  
  [ROLES.SITE_ENGINEER]: [
    { href: '/admin/dashboard', label: 'لوحة التحكم', icon: 'LayoutDashboard' },
    { href: '/admin/purchasing', label: 'إدارة المشتريات', icon: 'ShoppingCart' },
    { href: '/admin/purchasing/requests', label: 'طلبات الشراء', icon: 'ShoppingCart' },
  ],
  
  [ROLES.SITE_SUPERVISOR]: [
    { href: '/purchase-request', label: 'طلب شراء', icon: 'ShoppingCart' },
  ],
  
  [ROLES.SUPPLIER]: [
    { href: '/admin/dashboard', label: 'لوحة التحكم', icon: 'LayoutDashboard' },
    { href: '/admin/suppliers', label: 'بياناتي', icon: 'Users' },
    { href: '/admin/purchasing', label: 'العقود', icon: 'ShoppingCart' },
  ],
  
  [ROLES.CLIENT]: [
    { href: '/admin/dashboard', label: 'لوحة التحكم', icon: 'LayoutDashboard' },
    { href: '/admin/reports', label: 'تقارير المشاريع', icon: 'BarChart2' },
  ],
  
  [ROLES.SUPER_ADMIN]: [
    { href: '/admin/dashboard', label: 'لوحة التحكم', icon: 'LayoutDashboard' },
    { href: '/admin/content', label: 'إدارة المحتوى', icon: 'PenSquare' },
    { href: '/admin/cameras', label: 'إدارة الكاميرات', icon: 'Camera' },
    { href: '/admin/users', label: 'إدارة المستخدمين', icon: 'UserCog' },
    { href: '/admin/suppliers', label: 'الموردون', icon: 'Users' },
    { href: '/admin/jobs', label: 'طلبات التوظيف', icon: 'Briefcase' },
    { href: '/admin/messages', label: 'رسائل العملاء', icon: 'MessageSquare' },
    { href: '/admin/approved', label: 'المقبولون', icon: 'CheckCircle' },
    { href: '/admin/purchasing', label: 'إدارة المشتريات', icon: 'ShoppingCart' },
    { href: '/admin/reports', label: 'التقارير', icon: 'BarChart2' },
  ],
};

/* ─── Allowed Routes per Role ─── */
export const ROLE_ALLOWED_ROUTES = {
  [ROLES.COMPANY_MANAGER]: [
    '/admin/dashboard',
    '/admin/suppliers',
    '/admin/suppliers/*',
    '/admin/jobs',
    '/admin/jobs/*',
    '/admin/messages',
    '/admin/approved',
    '/admin/purchasing',
    '/admin/purchasing/*',
    '/admin/reports',
  ],
  
  [ROLES.PROJECT_MANAGER]: [
    '/admin/dashboard',
    '/admin/suppliers',
    '/admin/suppliers/*',
    '/admin/jobs',
    '/admin/jobs/*',
    '/admin/purchasing',
    '/admin/purchasing/*',
    '/admin/reports',
  ],
  
  [ROLES.PROCUREMENT_MANAGER]: [
    '/admin/dashboard',
    '/admin/purchasing',
    '/admin/purchasing/*',
  ],
  
  [ROLES.HR_MANAGER]: [
    '/admin/dashboard',
    '/admin/jobs',
    '/admin/jobs/*',
    '/admin/reports',
  ],
  
  [ROLES.ACCOUNTANT]: [
    '/admin/dashboard',
    '/admin/purchasing',
    '/admin/purchasing/orders',
    '/admin/purchasing/orders/*',
    '/admin/purchasing/reports',
    '/admin/reports',
  ],
  
  [ROLES.ENGINEERING_MANAGER]: [
    '/admin/dashboard',
    '/admin/suppliers',
    '/admin/suppliers/*',
    '/admin/purchasing',
    '/admin/purchasing/*',
    '/admin/reports',
  ],
  
  [ROLES.SITE_ENGINEER]: [
    '/admin/dashboard',
    '/admin/purchasing',
    '/admin/purchasing/requests',
    '/admin/purchasing/requests/*',
  ],
  
  [ROLES.SITE_SUPERVISOR]: [
    '/purchase-request',
  ],
  
  [ROLES.SUPPLIER]: [
    '/admin/dashboard',
    '/admin/suppliers',
    '/admin/purchasing',
  ],
  
  [ROLES.CLIENT]: [
    '/admin/dashboard',
    '/admin/reports',
  ],
  
  [ROLES.SUPER_ADMIN]: [
    '/admin/*',
  ],
};

/* ─── Helper Functions ─── */

/**
 * Get the dashboard route for a given role
 */
export function getDashboardForRole(role) {
  return ROLE_DASHBOARDS[role] || '/admin/dashboard';
}

/**
 * Get navigation items for a given role
 */
export function getNavigationForRole(role) {
  return ROLE_NAVIGATION[role] || [];
}

/**
 * Check if a role can access a specific route
 */
export function canRoleAccessRoute(role, pathname) {
  const allowedRoutes = ROLE_ALLOWED_ROUTES[role] || [];
  
  for (const route of allowedRoutes) {
    if (route === pathname) return true;
    if (route.endsWith('/*')) {
      const prefix = route.slice(0, -2);
      if (pathname.startsWith(prefix)) return true;
    }
  }
  
  return false;
}

/**
 * Get role label in Arabic
 */
export function getRoleLabel(role) {
  return ROLE_LABELS[role] || role;
}

/**
 * Get all available roles
 */
export function getAllRoles() {
  return Object.values(ROLES);
}
