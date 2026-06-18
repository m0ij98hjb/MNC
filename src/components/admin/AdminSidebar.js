'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { LayoutDashboard, Users, CheckCircle, BarChart2, ChevronRight, ChevronLeft } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/dashboard', labelKey: 'admin.dashboard',    icon: LayoutDashboard },
  { href: '/admin/suppliers', labelKey: 'admin.suppliersMenu', icon: Users },
  { href: '/admin/approved',  labelKey: 'admin.approvedMenu',  icon: CheckCircle },
  { href: '/admin/reports',   labelKey: 'admin.reportsMenu',   icon: BarChart2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { t, isRTL } = useLanguage();
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <aside
      className="hidden lg:flex flex-col w-56 shrink-0 sticky top-[68px] h-[calc(100vh-68px)] overflow-y-auto"
      style={{
        background: 'rgba(255,255,255,0.02)',
        borderInlineEnd: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Section label */}
      <div className="px-4 py-3.5 border-b border-white/[0.06]">
        <p className="text-[9px] font-semibold text-white/25 uppercase tracking-[2.5px]">
          {t('admin.loginTitle')}
        </p>
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
    </aside>
  );
}
