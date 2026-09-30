// Estructura de datos del panel de administración.
// Los datos de ejemplo fueron borrados: todo arranca vacío y está listo para conectar al backend.
// Se mantienen los mismos nombres de export para que las pantallas existentes sigan funcionando.

export type PaymentStatus = "al-dia" | "pendiente" | "mora" | "suspendida";

export const paymentLabels: Record<PaymentStatus, string> = {
  "al-dia": "Pagó / Al día",
  pendiente: "Falta por pagar",
  mora: "En mora",
  suspendida: "Suspendida",
};

export type PlanName = "Esther Start" | "Esther Pro" | "Esther Plus" | "Esther Enterprise";

export type PlanPrice = {
  name: PlanName;
  price: number;
  currency: string;
  seats: number;
};

export type Clinic = {
  id: string;
  name: string;
  city: string;
  plan: PlanName;
  mrr: number;
  status: PaymentStatus;
  nextCharge: string;
  aiMinutes: number;
  seats: number;
  since: string;
};

// Los precios se administran desde el panel (Dueño y Socio), no van fijos en el código.
export const plans: PlanPrice[] = [];

export const clinics: Clinic[] = [];

export const growth: { month: string; nuevas: number; total: number }[] = [];

export const aiUsageMonthly: { month: string; minutos: number }[] = [];

export const aiByFeature: { name: string; value: number }[] = [];

export const paymentSummary: { key: PaymentStatus; label: string; value: number }[] = [
  { key: "al-dia", label: "Al día", value: 0 },
  { key: "pendiente", label: "Pendientes", value: 0 },
  { key: "mora", label: "En mora", value: 0 },
  { key: "suspendida", label: "Suspendidas", value: 0 },
];

export const activityLog: { time: string; actor: string; text: string }[] = [];

export const tickets: {
  id: string;
  clinic: string;
  subject: string;
  priority: string;
  status: string;
}[] = [];

export const alerts: {
  tone: "destructive" | "warning" | "primary";
  title: string;
  detail: string;
}[] = [];

export const admins: {
  name: string;
  email: string;
  role: string;
  lastAccess: string;
  initials: string;
}[] = [];