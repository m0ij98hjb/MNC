'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Users, CheckCircle, BarChart2, LogOut, Briefcase, MessageSquare } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/dashboard', labelKey: 'admin.dashboard',     icon: LayoutDashboard },
  { href: '/admin/suppliers', labelKey: 'admin.suppliersMenu', icon: Users },
  { href: '/admin/jobs',      labelKey: 'admin.jobsMenu',      icon: Briefcase },
  { href: '/admin/messages',  label:    'رسائل العملاء',       icon: MessageSquare },
  { href: '/admin/approved',  labelKey: 'admin.approvedMenu',  icon: CheckCircle },
  { href: '/admin/reports',   labelKey: 'admin.reportsMenu',   icon: BarChart2 },
];

export default function AdminBottomNav() {
  const pathname = usePathname();
  const router   = useRouter();
  const { t }    = useLanguage();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/admin/login');
  };

  return (
    <>
      {/* Spacer — 72px content + safe area */}
      <div className="lg:hidden" style={{ height: 'calc(72px + env(safe-area-inset-bottom))' }} aria-hidden="true" />

      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-[95]"
        style={{
          background: 'rgba(5,5,8,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(201,163,77,0.28)',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.7)',
          /* safe-area padding BELOW the 72px content row */
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* 72px fixed-height content row */}
        <div className="flex" style={{ height: '72px' }}>

          {/* Nav links */}
          {NAV_ITEMS.map(({ href, labelKey, label, icon: Icon }) => {
            const active    = pathname === href || pathname.startsWith(href + '/');
            const navLabel  = label ?? t(labelKey);
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center flex-1 gap-1.5 transition-all duration-150 active:scale-95 relative px-1"
              >
                {/* Active top indicator */}
                {active && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full"
                    style={{ background: 'linear-gradient(90deg,transparent,#C9A34D,transparent)' }}
                  />
                )}
                <Icon
                  size={active ? 20 : 18}
                  style={{ color: active ? '#C9A34D' : 'rgba(255,255,255,0.65)', transition: 'all 0.2s' }}
                />
                <span
                  className="text-[10px] font-bold leading-tight text-center w-full"
                  style={{ color: active ? '#C9A34D' : 'rgba(255,255,255,0.65)' }}
                >
                  {navLabel}
                </span>
              </Link>
            );
          })}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center flex-1 gap-1.5 transition-all duration-150 active:scale-95 px-1"
          >
            <LogOut size={18} style={{ color: 'rgba(248,113,113,0.75)' }} />
            <span
              className="text-[10px] font-bold leading-tight text-center w-full"
              style={{ color: 'rgba(248,113,113,0.75)' }}
            >
              {t('admin.logout')}
            </span>
          </button>

        </div>
      </nav>
    </>
  );
}
