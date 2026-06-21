'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Users, CheckCircle, BarChart2,
  ChevronRight, ChevronLeft, LogOut, Briefcase
} from 'lucide-react';
import Image from 'next/image';

const NAV_ITEMS = [
  { href: '/admin/dashboard', labelKey: 'admin.dashboard',     icon: LayoutDashboard },
  { href: '/admin/suppliers', labelKey: 'admin.suppliersMenu', icon: Users },
  { href: '/admin/jobs',      labelKey: 'admin.jobsMenu',      icon: Briefcase },
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
      className="hidden lg:flex flex-col w-56 shrink-0 sticky top-[92px] h-[calc(100vh-92px)] overflow-y-auto"
      style={{
        background: 'rgba(255,255,255,0.02)',
        borderInlineEnd: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Director profile */}
      <div className="flex flex-col items-center px-4 pt-5 pb-4 border-b border-white/[0.06]">
        {/* Photo */}
        <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden mb-3"
          style={{ boxShadow: '0 0 0 2px rgba(200,169,110,0.35), 0 4px_20px_rgba(0,0,0,0.5)' }}
        >
          <div className="absolute inset-0 rounded-full"
            style={{ boxShadow: 'inset 0 0 0 2px rgba(200,169,110,0.25)' }}
          />
          <Image
            src="/asstes/directort.png"
            alt="Director"
            fill
            sizes="72px"
            className="object-cover object-top"
          />
        </div>
        {/* Name + role */}
        <p className="text-[13px] font-bold text-[#c8a96e] leading-tight text-center">
          م. مروان أحمد ناظر
        </p>
        {/* Gold underline */}
        <div className="mt-2.5 w-8 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-[#c8a96e]/50 to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3">
        <div className="space-y-0.5">
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
        </div>

        {/* Logout — directly below last nav item */}
        <div className="mt-2 pt-2 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-red-400/60 hover:text-red-400 hover:bg-red-500/6 border border-transparent hover:border-red-500/12 transition-all duration-200"
          >
            <LogOut size={15} className="shrink-0" />
            <span>{t('admin.logout')}</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
