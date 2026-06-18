'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const { user, login, error, setError } = useAuth();
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (user) router.replace('/admin/dashboard');
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#c8a96e]/10 border border-[#c8a96e]/20 mb-4">
            <Lock size={28} className="text-[#c8a96e]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">لوحة تحكم المورّدين</h1>
          <p className="text-sm text-white/40">تسجيل دخول المسؤول</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-white/50 mb-2 text-right">البريد الإلكتروني</label>
            <div className="relative">
              <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                required
                dir="ltr"
                placeholder="admin@mnc.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-10 pl-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e]/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-2 text-right">كلمة المرور</label>
            <div className="relative">
              <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                required
                dir="ltr"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-10 pl-10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e]/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c8a96e] hover:bg-[#b8995e] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
