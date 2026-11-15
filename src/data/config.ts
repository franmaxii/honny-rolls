/* ======================================================
   CONFIGURACIÓN DE LA TIENDA — editá esto
   ====================================================== */
export const STORE = {
  name: "Chibi Rolls",

  // WhatsApp de quien vende: código de país + número, sin "+", espacios ni guiones.
  // Ej. Argentina: +54 9 11 1234-5678  →  "5491112345678"
  whatsapp: "5491100000000",

  locale: "es-AR",
  currency: "ARS",

  credit: { label: "franmaxi.dev", url: "https://franmaxi.dev" },
} as const;

const money = new Intl.NumberFormat(STORE.locale, {
  style: "currency",
  currency: STORE.currency,
  maximumFractionDigits: 0,
});

export const formatPrice = (n: number): string => money.format(n);
