'use client';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCompanyManagerAccess } from '@/hooks/useCompanyManagerAccess';
import {
  ROLES,
  getDashboardForRole,
  getNavigationForRole,
  canRoleAccessRoute,
  getRoleLabel
} from '@/lib/roleBasedAccess';

/**
 * Hook for managing role-based access control
 * Reads user role from adminUsers collection and provides access control helpers
 */
export function useRoleAccess() {
  const { user, isSuperAdmin } = useAuth();
  const { lang } = useLanguage();
  const companyManagerModules = useCompanyManagerAccess();
  const [profile, setProfile] = useState(undefined); // undefined = loading
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setRole(null);
      return;
    }

    const unsub = onSnapshot(doc(db, 'adminUsers', user.uid), { includeMetadataChanges: true }, snap => {
      // Right after sign-in, local persistence can briefly report "not found"
      // from cache before the server-confirmed doc arrives. Treating that as
      // "no role" would fire AdminLayout's route guard on stale data and
      // bounce the user to the wrong page. Wait for a server-confirmed read
      // before trusting a negative result.
      if (!snap.exists() && snap.metadata.fromCache) return;

      if (snap.exists()) {
        const data = snap.data();
        setProfile({ id: snap.id, ...data });
        setRole(data.role || null);
      } else {
        setProfile(null);
        setRole(null);
      }
    });

    return unsub;
  }, [user]);

  const loading = user === undefined || (!!user && profile === undefined);
  
  // Determine effective role
  const effectiveRole = isSuperAdmin ? ROLES.SUPER_ADMIN : role;
  
  // Check if user is active
  const isActive = profile?.active !== false;

  return {
    loading,
    profile,
    role: effectiveRole,
    isActive,
    hasAccess: isActive && !!effectiveRole,
    
    // Helper functions
    getDashboard: () => getDashboardForRole(effectiveRole),
    getNavigation: (overrideLang) => getNavigationForRole(effectiveRole, overrideLang || lang, companyManagerModules),
    canAccessRoute: (pathname) => {
      if (!isActive || !effectiveRole) return false;
      return canRoleAccessRoute(effectiveRole, pathname, companyManagerModules);
    },
    getRoleLabel: (overrideLang) => getRoleLabel(effectiveRole, overrideLang || lang),
    isRole: (rolesToCheck) => {
      if (!effectiveRole) return false;
      if (Array.isArray(rolesToCheck)) {
        return rolesToCheck.includes(effectiveRole);
      }
      return effectiveRole === rolesToCheck;
    },
  };
}
