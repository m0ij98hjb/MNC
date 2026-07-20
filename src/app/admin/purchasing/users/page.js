'use client';
import { useEffect, useState } from 'react';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import PurchasingAccessGate from '@/components/purchasing/PurchasingAccessGate';
import PurchasingSubNav from '@/components/purchasing/PurchasingSubNav';
import { createPurchasingUser } from '@/lib/purchasingUserCreation';
import { ALL_ROLES, ROLE_LABEL_KEYS, ROLES } from '@/lib/purchasingConfig';
import { Loader2, Plus, X, UserCog, Power } from 'lucide-react';

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#c8a96e]/50 outline-none transition-all';
const labelCls = 'text-[#c8a96e] text-[10px] font-black uppercase tracking-widest block mb-1.5';

function emptyForm() {
  return { name: '', email: '', password: '', phone: '', jobTitle: '', department: '', projectName: '', role: ROLES.SITE_ENGINEER };
}

function CreateUserModal({ onClose, currentUid }) {
  const { t, isRTL } = useLanguage();
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (f, v) => setForm(x => ({ ...x, [f]: v }));

  const submit = async () => {
    setError('');
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setError(t('purchasing.userFormInvalid')); return;
    }
    setSaving(true);
    try {
      await createPurchasingUser({ ...form, createdByUid: currentUid });
      onClose();
    } catch (e) {
      setError(e.message || t('purchasing.actionFailed'));
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg bg-[#111118] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <h2 className="text-white font-bold text-base">{t('purchasing.addUser')}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8"><X size={18} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {error && <div className="rounded-xl px-4 py-3 text-sm bg-red-500/10 border border-red-500/25 text-red-400">{error}</div>}
          <div><label className={labelCls}>{t('purchasing.requesterName')}</label><input className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>{t('admin.emailLabel')}</label><input type="email" dir="ltr" className={inputCls} value={form.email} onChange={e => set('email', e.target.value)} /></div>
            <div><label className={labelCls}>{t('admin.passwordLabel')}</label><input type="password" dir="ltr" className={inputCls} value={form.password} onChange={e => set('password', e.target.value)} /></div>
            <div><label className={labelCls}>{t('purchasing.requesterPhone')}</label><input dir="ltr" className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
            <div>
              <label className={labelCls}>{t('purchasing.roleLabel')}</label>
              <select className={`${inputCls} appearance-none cursor-pointer`} value={form.role} onChange={e => set('role', e.target.value)}>
                {ALL_ROLES.filter(r => r !== ROLES.SUPER_ADMIN).map(r => <option key={r} value={r} className="bg-slate-800">{t(ROLE_LABEL_KEYS[r])}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>{t('purchasing.jobTitle')}</label><input className={inputCls} value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} /></div>
            <div><label className={labelCls}>{t('purchasing.department')}</label><input className={inputCls} value={form.department} onChange={e => set('department', e.target.value)} /></div>
          </div>
          <div><label className={labelCls}>{t('purchasing.projectName')}</label><input className={inputCls} value={form.projectName} onChange={e => set('projectName', e.target.value)} /></div>
        </div>
        <div className="px-6 py-4 border-t border-white/[0.07] flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm font-semibold hover:text-white">{t('admin.back')}</button>
          <button onClick={submit} disabled={saving} className="flex-1 py-2.5 rounded-xl text-black text-sm font-black flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#8a6a1e,#D5B25D,#e8c96e,#D5B25D,#8a6a1e)' }}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : t('purchasing.createUser')}
          </button>
        </div>
      </div>
    </div>
  );
}

function UsersContent() {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const [users, setUsers] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'purchasingUsers'), snap => setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  const toggleActive = async (u) => {
    setError('');
    try { await updateDoc(doc(db, 'purchasingUsers', u.id), { active: !u.active }); }
    catch (e) { setError(e.message || t('purchasing.actionFailed')); }
  };
  const changeRole = async (u, role) => {
    setError('');
    try { await updateDoc(doc(db, 'purchasingUsers', u.id), { role }); }
    catch (e) { setError(e.message || t('purchasing.actionFailed')); }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <PurchasingSubNav />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><UserCog size={20} className="text-[#c8a96e]" />{t('purchasing.usersTitle')}</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-black" style={{ background: 'linear-gradient(135deg,#8a6a1e,#D5B25D,#e8c96e,#D5B25D,#8a6a1e)' }}>
          <Plus size={14} /> {t('purchasing.addUser')}
        </button>
      </div>

      {error && <div className="rounded-xl px-4 py-3 text-sm bg-red-500/10 border border-red-500/25 text-red-400 mb-4">{error}</div>}

      <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
        {users === null ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={28} className="text-[#c8a96e] animate-spin" /></div>
        ) : users.length === 0 ? (
          <p className="text-center text-white/30 text-sm py-16">{t('admin.noResults')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  {[t('purchasing.requesterName'), t('admin.emailLabel'), t('purchasing.roleLabel'), t('purchasing.department'), t('admin.statusCol'), t('admin.actionsCol')].map(h => (
                    <th key={h} className="text-start text-xs text-white/30 font-medium px-5 py-3.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-white font-medium">{u.name}</td>
                    <td className="px-5 py-3.5 text-white/60 text-xs" dir="ltr">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <select value={u.role} onChange={e => changeRole(u, e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white appearance-none cursor-pointer">
                        {ALL_ROLES.filter(r => r !== ROLES.SUPER_ADMIN).map(r => <option key={r} value={r} className="bg-slate-800">{t(ROLE_LABEL_KEYS[r])}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-white/60 text-xs">{u.department || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.active !== false ? 'text-green-400 bg-green-500/12' : 'text-red-400 bg-red-500/12'}`}>
                        {u.active !== false ? t('purchasing.activeLabel') : t('purchasing.inactiveLabel')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggleActive(u)} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10" title={t('purchasing.toggleActive')}>
                        <Power size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && <CreateUserModal onClose={() => setShowAdd(false)} currentUid={user?.uid} />}
    </div>
  );
}

export default function PurchasingUsersPage() {
  return (
    <PurchasingAccessGate allow={['super_admin']}>
      <AdminPageLayout><UsersContent /></AdminPageLayout>
    </PurchasingAccessGate>
  );
}
