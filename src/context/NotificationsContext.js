'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SEEN_KEY = 'mnc_admin_seen_notifs';

const getSeen = () => {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch { return []; }
};

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [suppliers, setSuppliers] = useState([]);
  const [jobs, setJobs]           = useState([]);
  const [seen, setSeen]           = useState([]);

  // Load seen from localStorage on mount
  useEffect(() => { setSeen(getSeen()); }, []);

  // Listen to new suppliers (status === 'new')
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'suppliers'), snap => {
      setSuppliers(
        snap.docs
          .map(d => ({ id: d.id, type: 'supplier', ...d.data() }))
          .filter(d => d.status === 'new')
          .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
      );
    });
    return unsub;
  }, []);

  // Listen to new job applications (status === 'pending')
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'jobApplications'), snap => {
      setJobs(
        snap.docs
          .map(d => ({ id: d.id, type: 'job', ...d.data() }))
          .filter(d => d.status === 'pending')
          .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
      );
    });
    return unsub;
  }, []);

  const markSeen = useCallback((id) => {
    setSeen(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(SEEN_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const allNew   = [...suppliers, ...jobs].filter(n => !seen.includes(n.id));
  const unseenSuppliers = suppliers.filter(n => !seen.includes(n.id));
  const unseenJobs      = jobs.filter(n => !seen.includes(n.id));
  const unreadCount     = allNew.length;

  return (
    <NotificationsContext.Provider value={{
      allNew, unseenSuppliers, unseenJobs, unreadCount, markSeen,
      recentSuppliers: suppliers, recentJobs: jobs,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationsContext);
