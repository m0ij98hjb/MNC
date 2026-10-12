export const COMPANY = {
  name: "MNC Construction",
  email: "info@mnc.sa",
  phone: "0569898000",
  whatsapp: "966569898000", // international format, used for wa.me links
};

// Phone values that may still be saved in the dashboard (Firestore "contact"
// doc) from before: the old number, and this number in 966 format. Treated as
// unset so the site shows COMPANY.phone (0569898000).
export const LEGACY_PHONES = ["0598242385", "966569898000"];
export const LEGACY_WHATSAPP = "966598242385";
