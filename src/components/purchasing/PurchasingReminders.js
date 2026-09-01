'use client';
import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import { usePurchasingRole } from '@/hooks/usePurchasingRole';
import { STATUS, APPROVAL_STAGES, ROLES } from '@/lib/purchasingConfig';
import { projectKeyFor, computeBudgetSummary } from '@/lib/purchasingBudget';
import { AlertTriangle, Clock, Wallet } from 'lucide-react';
import Link from 'next/link';

const DAY = 86400;

function daysSince(ts) {
  if (!ts?.seconds) return 0;
  return (Date.now() / 1000 - ts.seconds) / DAY;
}

function Banner({ icon: Icon, cls, text, href }) {
  const inner = (
    <div className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold border ${cls}`}>
      <Icon size={14} className="shrink-0" /> <span className="truncate">{text}</span>
    </div>
  );
  return href ? <Link href={href} className="block hover:opacity-80 transition-opacity">{inner}</Link> : inner;
}

/** Client-computed reminders (no scheduled backend jobs exist in this architecture) shown to the relevant role. */
export default function PurchasingReminders({ requests }) {
  const { t } = useLanguage();
  const { role, isRole } = usePurchasingRole();
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const canSeeBudgets = isRole(ROLES.PROCUREMENT_MANAGER, ROLES.SUPER_ADMIN);
    if (!canSeeBudgets) return;
    const unsub = onSnapshot(collection(db, 'projectBudgets'), snap => setBudgets(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const banners = useMemo(() => {
    if (!requests) return [];
    const list = [];
    const openStatuses = [STATUS.REJECTED];

    const myStage = APPROVAL_STAGES.find(s => s.role === role);
    if (myStage) {
      const stale = requests.filter(r => r.status === myStage.status && daysSince(r.updatedAt) >= 3);
      if (stale.length > 0) list.push({ key: 'approval', icon: Clock, cls: 'bg-blue-500/10 border-blue-500/25 text-blue-300', text: `${stale.length} ${t('purchasing.reminderApprovalPending')}`, href: '/admin/purchasing/requests' });
    }

    const today = new Date();
    const delayed = requests.filter(r => !openStatuses.includes(r.status) && r.items?.some(it => it.neededDate && new Date(it.neededDate) < today));
    if (delayed.length > 0) list.push({ key: 'delayed', icon: AlertTriangle, cls: 'bg-red-500/10 border-red-500/25 text-red-300', text: `${delayed.length} ${t('purchasing.reminderDelayedRequests')}`, href: '/admin/purchasing/requests' });

    if (isRole(ROLES.PROCUREMENT_MANAGER, ROLES.SUPER_ADMIN) && budgets.length > 0) {
      const overBudget = budgets.filter(b => {
        const projectRequests = requests.filter(r => projectKeyFor(r.projectName) === b.id);
        return computeBudgetSummary({ approvedBudget: b.approvedBudget, projectRequests }).consumedPct >= 90;
      });
      if (overBudget.length > 0) list.push({ key: 'budget', icon: Wallet, cls: 'bg-red-500/10 border-red-500/25 text-red-300', text: `${overBudget.length} ${t('purchasing.reminderBudgetWarning')}`, href: '/admin/purchasing/budgets' });
    }

    return list;
  }, [requests, role, isRole, budgets, t]);

  if (banners.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
      {banners.map(b => <Banner key={b.key} icon={b.icon} cls={b.cls} text={b.text} href={b.href} />)}
    </div>
  );
}
