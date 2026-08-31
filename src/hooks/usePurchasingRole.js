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
  const [adminUserRole, setAdminUserRole] = useState(undefined);

  useEffect(() => {
    if (!user) return;
    // includeMetadataChanges + the fromCache check below: right after sign-in,
    // local persistence can briefly report "not found" from cache before the
    // server-confirmed doc arrives — ignore that transient negative read so
    // access checks don't flicker to "no role" for a moment.
    const unsub1 = onSnapshot(doc(db, 'purchasingUsers', user.uid), { includeMetadataChanges: true }, snap => {
      if (!snap.exists() && snap.metadata.fromCache) return;
      setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    });
    const unsub2 = onSnapshot(doc(db, 'adminUsers', user.uid), { includeMetadataChanges: true }, snap => {
      if (!snap.exists() && snap.metadata.fromCache) return;
      setAdminUserRole(snap.exists() ? snap.data().role : null);
    });
    return () => {
      unsub1();
      unsub2();
    };
  }, [user]);

  const effectiveProfile = user ? profile : null;
  const loading = user === undefined || (!!user && profile === undefined && adminUserRole === undefined);

  const isPurchasingOnlyUser = user?.email?.trim().toLowerCase() === 'engineer.tester@mnc.com';
  const isCompanyManager = adminUserRole === 'company_manager';

  const role = isSuperAdmin
    ? ROLES.SUPER_ADMIN
    : (isPurchasingOnlyUser || isCompanyManager)
    ? ROLES.PROCUREMENT_MANAGER
    : (effectiveProfile?.role ?? null);

  const active = isSuperAdmin || isPurchasingOnlyUser || isCompanyManager ? true : (effectiveProfile?.active !== false && !!effectiveProfile);

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
