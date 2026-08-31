'use client';
import { useEffect, useState, useCallback } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { usePurchasingRole } from './usePurchasingRole';
import { ROLES, ALL_ROLES } from '@/lib/purchasingConfig';

/**
 * Independent from the site's existing NotificationsContext (suppliers/jobs/contacts) —
 * this purchasing module keeps its own notification collection and feed.
 */
export function usePurchaseNotifications() {
  const { user } = useAuth();
  const { role } = usePurchasingRole();
  const [byUid, setByUid] = useState([]);
  const [byRole, setByRole] = useState([]);

  useEffect(() => {
    if (!user) return; // no subscription needed; falls back to [] below
    const q = query(collection(db, 'purchaseNotifications'), where('targetUid', '==', user.uid));
    const unsub = onSnapshot(q, snap => setByUid(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!role) return; // no subscription needed; falls back to [] below
    // Super admin oversees the whole module, so it should see every role-targeted
    // notification (e.g. a new request notifies targetRole: 'procurement_manager'),
    // not just ones literally addressed to 'super_admin' (which nothing ever sends).
    const roles = role === ROLES.SUPER_ADMIN ? ALL_ROLES : [role];
    const q = query(collection(db, 'purchaseNotifications'), where('targetRole', 'in', roles));
    const unsub = onSnapshot(q, snap => setByRole(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, [role]);

  const notifications = [...(user ? byUid : []), ...(role ? byRole : [])]
    .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = useCallback(async (id) => {
    await updateDoc(doc(db, 'purchaseNotifications', id), { read: true });
  }, []);

  return { notifications, unreadCount, markRead };
}
