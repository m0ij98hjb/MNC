'use client';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { ROLES, ADMIN_MODULE_ROLES } from '@/lib/purchasingConfig';

/**
 * Resolves the current user's role inside the Purchasing module.
 * The site's existing super-admin (whitelisted email) is always
 * treated as ROLES.SUPER_ADMIN here, even without a purchasingUsers doc.
 */
export function usePurchasingRole() {
  const { user, isSuperAdmin } = useAuth();
  const [profile, setProfile] = useState(undefined); // undefined = loading

  useEffect(() => {
    if (!user) return; // no subscription needed — resolved via render-time fallback below
    const unsub = onSnapshot(doc(db, 'purchasingUsers', user.uid), snap => {
      setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    });
    return unsub;
  }, [user]);

  const effectiveProfile = user ? profile : null;
  const loading = user === undefined || (!!user && effectiveProfile === undefined);

  const role = isSuperAdmin ? ROLES.SUPER_ADMIN : (effectiveProfile?.role ?? null);
  const active = isSuperAdmin ? true : (effectiveProfile?.active !== false && !!effectiveProfile);

  return {
    loading,
    profile: effectiveProfile,
    role,
    active,
    hasAccess: active && !!role,
    canAccessAdminModule: active && ADMIN_MODULE_ROLES.includes(role),
    isRole: (...roles) => active && roles.includes(role),
  };
}
