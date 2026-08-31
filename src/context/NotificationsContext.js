'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { usePurchasingRole } from '@/hooks/usePurchasingRole';
import { ROLES as PURCHASING_ROLES, ALL_ROLES as ALL_PURCHASING_ROLES } from '@/lib/purchasingConfig';

const BELL_KEY = 'mnc_admin_bell_opened_at';

const getBellTime = () => {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem(BELL_KEY) || 0);
};

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const { canAccessRoute } = useRoleAccess();
  const { role: purchasingRole } = usePurchasingRole();

  const canSeeSuppliers = canAccessRoute('/admin/suppliers');
  const canSeeJobs       = canAccessRoute('/admin/jobs');
  const canSeeMessages   = canAccessRoute('/admin/messages');

  const [suppliers, setSuppliers] = useState([]);
  const [jobs, setJobs]           = useState([]);
  const [contacts, setContacts]   = useState([]);
  const [purchaseNotifsByRole, setPurchaseNotifsByRole] = useState([]);
  const [purchaseNotifsByUid, setPurchaseNotifsByUid] = useState([]);
  const [bellOpenedAt, setBellOpenedAt] = useState(0);

  useEffect(() => {
    queueMicrotask(() => setBellOpenedAt(getBellTime()));
  }, []);

  // ── Suppliers (gated by the same permission that guards /admin/suppliers) ──
  useEffect(() => {
    if (!canSeeSuppliers) { setSuppliers([]); return; }
    const unsub = onSnapshot(collection(db, 'suppliers'), snap => {
      setSuppliers(
        snap.docs
          .map(d => ({ id: d.id, type: 'supplier', ...d.data() }))
          .filter(d => d.status === 'new')
          .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
      );
    });
    return unsub;
  }, [canSeeSuppliers]);

  // ── Job applications (gated by /admin/jobs access) ──
  useEffect(() => {
    if (!canSeeJobs) { setJobs([]); return; }
    const unsub = onSnapshot(collection(db, 'jobApplications'), snap => {
      setJobs(
        snap.docs
          .map(d => ({ id: d.id, type: 'job', ...d.data() }))
          .filter(d => d.status === 'pending')
          .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
      );
    });
    return unsub;
  }, [canSeeJobs]);

  // ── Customer messages (gated by /admin/messages access) ──
  useEffect(() => {
    if (!canSeeMessages) { setContacts([]); return; }
    const unsub = onSnapshot(collection(db, 'contacts'), snap => {
      setContacts(
        snap.docs
          .map(d => ({ id: d.id, type: 'contact', ...d.data() }))
          .filter(d => (d.status || 'new') === 'new')
          .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
      );
    });
    return unsub;
  }, [canSeeMessages]);

  // ── Purchasing notifications (own collection) — role-targeted (e.g. "new
  //    request" sent to targetRole: 'procurement_manager'; super admin sees
  //    every role) plus ones addressed straight to this user's uid (e.g. a
  //    rejection notice sent back to the request's submitter) ──
  useEffect(() => {
    if (!purchasingRole) { setPurchaseNotifsByRole([]); return; }
    const roles = purchasingRole === PURCHASING_ROLES.SUPER_ADMIN ? ALL_PURCHASING_ROLES : [purchasingRole];
    const unsub = onSnapshot(
      query(collection(db, 'purchaseNotifications'), where('targetRole', 'in', roles)),
      snap => setPurchaseNotifsByRole(snap.docs.map(d => ({ id: d.id, type: 'purchase', ...d.data() })))
    );
    return unsub;
  }, [purchasingRole]);

  useEffect(() => {
    if (!user) { setPurchaseNotifsByUid([]); return; }
    const unsub = onSnapshot(
      query(collection(db, 'purchaseNotifications'), where('targetUid', '==', user.uid)),
      snap => setPurchaseNotifsByUid(snap.docs.map(d => ({ id: d.id, type: 'purchase', ...d.data() })))
    );
    return unsub;
  }, [user]);

  const purchaseNotifs = [...purchaseNotifsByRole, ...purchaseNotifsByUid];

  // Mark all as seen by saving current timestamp — badge goes to 0
  const markBellOpened = useCallback(() => {
    const now = Date.now();
    localStorage.setItem(BELL_KEY, String(now));
    setBellOpenedAt(now);
    purchaseNotifs.filter(n => !n.read).forEach(n => {
      updateDoc(doc(db, 'purchaseNotifications', n.id), { read: true }).catch(() => {});
    });
  }, [purchaseNotifs]);

  const allNotifications = [...suppliers, ...jobs, ...contacts, ...purchaseNotifs]
    .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));

  // Unread = created AFTER last bell open (purchase notifs additionally track their own `read` flag)
  const unreadCount = allNotifications.filter(n => {
    if (n.type === 'purchase') return !n.read;
    const createdMs = (n.createdAt?.seconds ?? 0) * 1000;
    return createdMs > bellOpenedAt;
  }).length;

  return (
    <NotificationsContext.Provider value={{
      allNotifications,
      unreadCount,
      markBellOpened,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationsContext);
