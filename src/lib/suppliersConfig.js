export const ACTIVITY_TYPES = [
  'خرسانة جاهزة','حديد تسليح','مواد بناء','أخشاب','سقالات',
  'سباكة','كهرباء','جبس','جبس بورد','رخام','بلاط وسيراميك',
  'مزايكو','ألمنيوم','زجاج','دهانات','تكييف','معدات ثقيلة',
  'نقل ومواصلات','أخرى',
];

export const STATUS_CONFIG = {
  new:          { label: 'جديد',          color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  under_review: { label: 'قيد المراجعة',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  approved:     { label: 'معتمد',          color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  rejected:     { label: 'مرفوض',          color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
};

export const FILE_FIELDS = [
  { key: 'commercialRegisterFile', label: 'السجل التجاري',         accept: '.pdf,.jpg,.jpeg,.png' },
  { key: 'taxCertificateFile',     label: 'شهادة الزكاة والضريبة', accept: '.pdf,.jpg,.jpeg,.png' },
  { key: 'catalogFile',            label: 'كتالوج PDF',            accept: '.pdf'                },
  { key: 'priceListFile',          label: 'قائمة الأسعار',         accept: '.pdf,.xls,.xlsx'     },
  { key: 'images',                 label: 'صور المنتجات',           accept: '.jpg,.jpeg,.png,.webp', multiple: true },
];
