'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  doc, onSnapshot, setDoc, collection, serverTimestamp, increment, addDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { usePurchasingRole } from '@/hooks/usePurchasingRole';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import PurchasingAccessGate from '@/components/purchasing/PurchasingAccessGate';
import AttachmentsUploader from '@/components/purchasing/AttachmentsUploader';
import { ROLES, STATUS } from '@/lib/purchasingConfig';
import { applyStatusChange, addHistoryEntry, notify, nextPONumber } from '@/lib/purchasingApi';
import { stockKeyFor, checkAvailability, anyStockAvailable } from '@/lib/purchasingWarehouse';
import { Loader2, ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const WarehouseAvailabilityModal = dynamic(() => import('@/components/purchasing/WarehouseAvailabilityModal'), { ssr: false });

function CreatePOContent({ requestId }) {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = usePurchasingRole();
  const actorName = profile?.name || user?.displayName || user?.email || '—';

  const [request, setRequest] = useState(undefined);
  const [suppliers, setSuppliers] = useState(null);
  const [stockMap, setStockMap] = useState({});
  const [supplierId, setSupplierId] = useState('');
  const [price, setPrice] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [warranty, setWarranty] = useState('');
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [availabilityModal, setAvailabilityModal] = useState(null);

  useEffect(() => {
    const u1 = onSnapshot(doc(db, 'purchaseRequests', requestId), s => setRequest(s.exists() ? { id: s.id, ...s.data() } : null));
    const u2 = onSnapshot(collection(db, 'purchasingSuppliers'), snap => setSuppliers(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const u3 = onSnapshot(collection(db, 'warehouseStock'), snap => {
      const map = {}; snap.docs.forEach(d => { map[d.id] = d.data(); }); setStockMap(map);
    });
    return () => { u1(); u2(); u3(); };
  }, [requestId]);

  const startIssuePO = () => {
    setError('');
    if (!supplierId) { setError(t('purchasing.supplierRequired')); return; }
    const availability = checkAvailability(request.items, stockMap);
    if (anyStockAvailable(availability)) {
      setAvailabilityModal(availability);
    } else {
      finalizeIssuePO([]);
    }
  };

  const finalizeIssuePO = async (issuePlan) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    setBusy(true);
    setError('');
    try {
      const issuedItems = (issuePlan || []).filter(a => a.issueQty > 0);
      if (issuedItems.length > 0) {
        await Promise.all(issuedItems.map(a => setDoc(doc(db, 'warehouseStock', stockKeyFor(a.itemName)), {
          quantityOnHand: increment(-a.issueQty), updatedAt: serverTimestamp(),
        }, { merge: true })));
        await addDoc(collection(db, 'warehouseIssues'), {
          requestId, requestNumber: request.requestNumber, items: issuedItems,
          issuedByUid: user.uid, issuedByName: actorName, issuedAt: serverTimestamp(),
        });
      }

      const issuedMap = Object.fromEntries(issuedItems.map(a => [a.itemId, a.issueQty]));
      const remainingItems = request.items
        .map(it => ({ ...it, quantity: (Number(it.quantity) || 0) - (issuedMap[it.id] || 0) }))
        .filter(it => it.quantity > 0);

      setAvailabilityModal(null);

      if (remainingItems.length === 0) {
        // Fully covered by existing warehouse stock — no purchase needed.
        await applyStatusChange(requestId, STATUS.DELIVERED_PENDING);
        await addHistoryEntry(requestId, { userId: user.uid, userName: actorName, role: ROLES.PROCUREMENT_MANAGER, action: 'fulfilled_from_warehouse', previousStatus: STATUS.APPROVED, newStatus: STATUS.DELIVERED_PENDING, notes: t('purchasing.fulfilledFromWarehouseNote') });
        await notify({ targetRole: ROLES.PROCUREMENT_MANAGER, type: 'delivered_pending', requestId, requestNumber: request.requestNumber, title: t('purchasing.notifDeliveredPendingTitle'), message: request.projectName });
        router.push(`/admin/purchasing/requests/${requestId}`);
        return;
      }

      const poNumber = await nextPONumber();
      const poRef = doc(collection(db, 'purchaseOrders'));
      await setDoc(poRef, {
        poNumber, requestId, requestNumber: request.requestNumber, projectName: request.projectName,
        supplierId, supplierName: supplier?.name || '', items: remainingItems,
        totalValue: Number(price) || request.totalEstimatedCost, deliveryTime, warranty, notes,
        issuedByUid: user.uid, issuedByName: actorName, issuedAt: serverTimestamp(), status: 'issued', attachments,
        warehouseIssuedItems: issuedItems.length > 0 ? issuedItems : null,
      });
      await applyStatusChange(requestId, STATUS.PO_ISSUED, { purchaseOrderId: poRef.id });
      await addHistoryEntry(requestId, { userId: user.uid, userName: actorName, role: ROLES.PROCUREMENT_MANAGER, action: 'po_issued', previousStatus: STATUS.APPROVED, newStatus: STATUS.PO_ISSUED, notes: `${supplier?.name || ''} — ${poNumber}` });
      await notify({ targetUid: request.requesterUid, type: 'po_issued', requestId, requestNumber: request.requestNumber, title: t('purchasing.notifPOIssuedTitle'), message: poNumber });
      router.push(`/admin/purchasing/orders/${poRef.id}`);
    } catch (e) {
      setError(e.message);
    } finally { setBusy(false); }
  };

  if (request === undefined || suppliers === null) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={28} className="animate-spin text-[#c8a96e]" /></div>;
  if (request === null) return <div className="text-center text-white/40 py-20">{t('admin.noResults')}</div>;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">{t('purchasing.createPOPageTitle')}</h1>
          <p className="text-sm text-white/40 mt-1" dir="ltr">{request.requestNumber} · {request.projectName}</p>
        </div>
        <Link href={`/admin/purchasing/requests/${requestId}`} className="text-xs text-[#c8a96e] hover:underline flex items-center gap-1">
          {isRTL ? <ArrowRight size={12} /> : <ArrowLeft size={12} />} {t('purchasing.backToRequest')}
        </Link>
      </div>

      {error && <div className="rounded-xl px-4 py-3 text-sm bg-red-500/10 border border-red-500/25 text-red-400">{error}</div>}

      {request.status !== STATUS.APPROVED ? (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 text-sm text-white/50">
          {t('purchasing.poNotAvailableNote')}
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2"><ShoppingCart size={14} className="text-[#c8a96e]" />{t('purchasing.selectSupplierTitle')}</h2>

          {suppliers.length === 0 ? (
            <p className="text-white/30 text-sm">{t('purchasing.noSuppliersYet')} — <Link href="/admin/purchasing/suppliers" className="text-[#c8a96e] hover:underline">{t('purchasing.addSupplierLink')}</Link></p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/40 block mb-1.5">{t('purchasing.colSupplier')}</label>
                <select value={supplierId} onChange={e => setSupplierId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#c8a96e]/50 appearance-none cursor-pointer">
                  <option value="" className="bg-slate-800">—</option>
                  {suppliers.map(s => <option key={s.id} value={s.id} className="bg-slate-800">{s.name}{s.specialty ? ` · ${s.specialty}` : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1.5">{t('purchasing.colPrice')}</label>
                <input type="number" min="0" dir="ltr" value={price} onChange={e => setPrice(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#c8a96e]/50" />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1.5">{t('purchasing.colDeliveryTime')}</label>
                <input value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#c8a96e]/50" />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1.5">{t('purchasing.colWarranty')}</label>
                <input value={warranty} onChange={e => setWarranty(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#c8a96e]/50" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-white/40 block mb-1.5">{t('purchasing.generalNotes')}</label>
                <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#c8a96e]/50 resize-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-white/40 block mb-1.5">{t('purchasing.attachments')}</label>
                <AttachmentsUploader pathPrefix={`purchaseOrders/${requestId}`} attachments={attachments} onChange={setAttachments} />
              </div>
            </div>
          )}

          <button onClick={startIssuePO} disabled={busy || suppliers.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#8a6a1e,#D5B25D,#e8c96e,#D5B25D,#8a6a1e)' }}>
            {busy ? <Loader2 size={15} className="animate-spin" /> : <ShoppingCart size={15} />} {t('purchasing.issuePOButton')}
          </button>
        </div>
      )}

      {availabilityModal && (
        <WarehouseAvailabilityModal
          availability={availabilityModal}
          busy={busy}
          onClose={() => setAvailabilityModal(null)}
          onConfirm={finalizeIssuePO}
        />
      )}
    </div>
  );
}

export default function RFQPage() {
  const { requestId } = useParams();
  return (
    <PurchasingAccessGate allow={['procurement_manager']}>
      <AdminPageLayout><CreatePOContent requestId={requestId} /></AdminPageLayout>
    </PurchasingAccessGate>
  );
}
