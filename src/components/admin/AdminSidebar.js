'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Users, CheckCircle, BarChart2,
  ChevronRight, ChevronLeft, UserCircle, LogOut
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/dashboard', labelKey: 'admin.dashboard',     icon: LayoutDashboard },
  { href: '/admin/suppliers', labelKey: 'admin.suppliersMenu', icon: Users },
  { href: '/admin/approved',  labelKey: 'admin.approvedMenu',  icon: CheckCircle },
  { href: '/admin/reports',   labelKey: 'admin.reportsMenu',   icon: BarChart2 },
];

export default function AdminSidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { t, isRTL } = useLanguage();
  const { logout } = useAuth();

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  const handleLogout = async () => {
    await logout();
    router.replace('/admin/login');
  };

  return (
    <aside
      className="hidden lg:flex flex-col w-56 shrink-0 sticky top-[68px] h-[calc(100vh-68px)] overflow-y-auto"
      style={{
        background: 'rgba(255,255,255,0.02)',
        borderInlineEnd: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Manager info */}
      <div className="px-3 pt-4 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl bg-[#c8a96e]/6 border border-[#c8a96e]/12">
          <UserCircle size={18} className="text-[#c8a96e] shrink-0" />
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-[#c8a96e] leading-tight truncate">
              {t('admin.managerTitle')}
            </p>
            <p className="text-[9px] text-white/25 uppercase tracking-wider mt-0.5">Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200
                ${active
                  ? 'bg-[#c8a96e]/10 text-[#c8a96e] font-semibold'
                  : 'text-white/45 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon size={15} className="shrink-0" />
              <span className="flex-1">{t(labelKey)}</span>
              {active && <ChevronIcon size={12} className="opacity-50 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-4 pt-2 border-t border-white/[0.06]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-red-400/60 hover:text-red-400 hover:bg-red-500/6 border border-transparent hover:border-red-500/12 transition-all duration-200"
        >
          <LogOut size={15} className="shrink-0" />
          <span>{t('admin.logout')}</span>
        </button>
      </div>
    </aside>
  );
}
