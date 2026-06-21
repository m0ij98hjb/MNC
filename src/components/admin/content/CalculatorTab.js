'use client';
import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { loadSiteContent, saveSiteContent } from '@/lib/siteContent';
import { Field, Section, SaveBtn, TabLoading } from './Shared';

const DEF_RATES = {
  residential: { economic: 1800, standard: 2500, premium: 3800, ultra: 6000 },
  commercial:  { economic: 2200, standard: 3200, premium: 5000, ultra: 8000 },
  industrial:  { economic: 1500, standard: 2000, premium: 3000, ultra: 5000 },
  renovation:  { economic: 800,  standard: 1400, premium: 2200, ultra: 3500 },
};

const TYPE_LABELS   = { residential: 'سكني', commercial: 'تجاري', industrial: 'صناعي', renovation: 'ترميم' };
const QUALITY_LABELS = { economic: 'اقتصادي', standard: 'قياسي', premium: 'فاخر', ultra: 'فائق' };

export default function CalculatorTab() {
  const [rates, setRates]     = useState(DEF_RATES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    loadSiteContent('calculator').then(d => {
      if (d.rates) setRates(d.rates);
      setLoading(false);
    });
  }, []);

  const setRate = (type, quality, val) => {
    setRates(p => ({ ...p, [type]: { ...p[type], [quality]: Number(val) } }));
  };

  const save = async () => {
    setSaving(true);
    try { await saveSiteContent('calculator', { rates }); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    finally { setSaving(false); }
  };

  if (loading) return <TabLoading />;

  return (
    <div className="space-y-5 max-w-2xl">
      <Section title="أسعار المتر المربع (ريال سعودي)" icon={Calculator}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-start text-[11px] text-white/35 font-semibold pb-3 pe-3">النوع</th>
                {Object.keys(QUALITY_LABELS).map(q => (
                  <th key={q} className="text-center text-[11px] text-white/35 font-semibold pb-3 px-2">{QUALITY_LABELS[q]}</th>
                ))}
              </tr>
            </thead>
            <tbody className="space-y-2">
              {Object.entries(TYPE_LABELS).map(([type, label]) => (
                <tr key={type}>
                  <td className="pe-3 pb-3">
                    <span className="text-xs font-bold text-white/60">{label}</span>
                  </td>
                  {Object.keys(QUALITY_LABELS).map(q => (
                    <td key={q} className="px-2 pb-3">
                      <input
                        type="number"
                        value={rates[type]?.[q] ?? 0}
                        onChange={e => setRate(type, q, e.target.value)}
                        className="w-full px-2 py-2 rounded-lg text-center text-sm text-white bg-white/[0.04] border border-white/10 focus:border-[#c8a96e]/50 focus:outline-none transition-colors"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-white/20 mt-2">* الأسعار بالريال السعودي للمتر المربع</p>
      </Section>

      <SaveBtn saving={saving} saved={saved} onClick={save} />
    </div>
  );
}
