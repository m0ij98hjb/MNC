'use client';
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DEFAULT_COMPANY_MANAGER_MODULES } from '@/lib/roleBasedAccess';

/**
 * Live-reads which dashboard modules the Company Manager role currently has
 * access to (settings/companyManagerAccess). Editable from Admin > Users by
 * a super admin — changes apply instantly, no code change or redeploy.
 * Falls back to full access if the settings doc hasn't been created yet.
 */
export function useCompanyManagerAccess() {
  const [modules, setModules] = useState(DEFAULT_COMPANY_MANAGER_MODULES);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'companyManagerAccess'), (snap) => {
      const data = snap.data();
      setModules(Array.isArray(data?.modules) ? data.modules : DEFAULT_COMPANY_MANAGER_MODULES);
    });
    return unsub;
  }, []);

  return modules;
}
