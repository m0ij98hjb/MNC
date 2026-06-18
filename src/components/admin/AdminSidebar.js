'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Users, CheckCircle, BarChart2,
  LogOut, Menu, X, ChevronLeft
} from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { href: '/admin/dashboard',  label: 'لوحة التحكم',    icon: LayoutDashboard },
  { href: '/admin/suppliers',  label: 'الموردون',        icon: Users },
  { href: '/admin/approved',   label: 'الموردون المعتمدون', icon: CheckCircle },
  { href: '/admin/reports',    label: 'التقارير',        icon: BarChart2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/admin/login');
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-[10001] bg-[#1a1a1a] border border-white/10 rounded-xl p-2.5 text-white"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-[10001] bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 h-full w-64 bg-[#111] border-l border-white/[0.07] z-[10002]
        flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : 'translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.07]">
          <div>
            <p className="text-white font-bold text-base leading-tight">MNC</p>
            <p className="text-white/40 text-xs">إدارة الموردين</p>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors
                  ${active
                    ? 'bg-[#c8a96e]/10 text-[#c8a96e] font-semibold'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon size={17} />
                <span>{label}</span>
                {active && <ChevronLeft size={14} className="mr-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5 border-t border-white/[0.07] pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut size={17} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}
