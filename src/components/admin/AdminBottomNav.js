'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Users, CheckCircle, BarChart2, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/dashboard', labelKey: 'admin.dashboard',     icon: LayoutDashboard },
  { href: '/admin/suppliers', labelKey: 'admin.suppliersMenu', icon: Users },
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
      {/* Spacer so content isn't hidden behind the bar */}
      <div className="lg:hidden h-[62px]" aria-hidden="true" />

      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-[95] flex"
        style={{
          height: '62px',
          background: 'rgba(5,5,8,0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(201,163,77,0.28)',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.7)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Nav links */}
        {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center flex-1 gap-1 transition-all duration-150 active:scale-95 relative"
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
                style={{ color: active ? '#C9A34D' : 'rgba(255,255,255,0.28)', transition: 'all 0.2s' }}
              />
              <span
                className="text-[9px] font-bold leading-none truncate max-w-[56px] text-center"
                style={{ color: active ? '#C9A34D' : 'rgba(255,255,255,0.28)' }}
              >
                {t(labelKey)}
              </span>
            </Link>
          );
        })}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center flex-1 gap-1 transition-all duration-150 active:scale-95"
        >
          <LogOut size={18} style={{ color: 'rgba(248,113,113,0.5)' }} />
          <span
            className="text-[9px] font-bold leading-none"
            style={{ color: 'rgba(248,113,113,0.5)' }}
          >
            {t('admin.logout')}
          </span>
        </button>
      </nav>
    </>
  );
}
