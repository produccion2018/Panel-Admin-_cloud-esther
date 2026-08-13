export type PaymentStatus = "al-dia" | "pendiente" | "mora";

export const paymentLabels: Record<PaymentStatus, string> = {
  "al-dia": "Pagó / Al día",
  pendiente: "Falta por pagar",
  mora: "En mora",
};

export type Clinic = {
  id: string;
  name: string;
  city: string;
  plan: "Starter" | "Pro" | "Clínica+" | "Enterprise";
  mrr: number;
  status: PaymentStatus;
  nextCharge: string;
  aiMinutes: number;
  seats: number;
  since: string;
};

export const clinics: Clinic[] = [
  { id: "CE-1041", name: "Clínica Dental Aurora", city: "Buenos Aires", plan: "Clínica+", mrr: 249, status: "al-dia", nextCharge: "05 Sep 2026", aiMinutes: 1840, seats: 12, since: "Mar 2025" },
  { id: "CE-1042", name: "OdontoSalud Palermo", city: "Buenos Aires", plan: "Pro", mrr: 149, status: "al-dia", nextCharge: "08 Sep 2026", aiMinutes: 1320, seats: 8, since: "May 2025" },
  { id: "CE-1043", name: "Sonrisa Norte", city: "Rosario", plan: "Pro", mrr: 149, status: "pendiente", nextCharge: "18 Ago 2026", aiMinutes: 980, seats: 6, since: "Jun 2025" },
  { id: "CE-1044", name: "Dental Care Córdoba", city: "Córdoba", plan: "Enterprise", mrr: 480, status: "al-dia", nextCharge: "01 Sep 2026", aiMinutes: 2410, seats: 24, since: "Ene 2025" },
  { id: "CE-1045", name: "Implantes Mendoza", city: "Mendoza", plan: "Starter", mrr: 79, status: "mora", nextCharge: "22 Jul 2026", aiMinutes: 310, seats: 3, since: "Sep 2025" },
  { id: "CE-1046", name: "Ortodoncia Belgrano", city: "Buenos Aires", plan: "Pro", mrr: 149, status: "al-dia", nextCharge: "11 Sep 2026", aiMinutes: 1105, seats: 7, since: "Oct 2025" },
  { id: "CE-1047", name: "Centro Odontológico Sur", city: "La Plata", plan: "Clínica+", mrr: 249, status: "pendiente", nextCharge: "16 Ago 2026", aiMinutes: 1520, seats: 11, since: "Nov 2025" },
  { id: "CE-1048", name: "Estética Dental Salta", city: "Salta", plan: "Starter", mrr: 79, status: "al-dia", nextCharge: "27 Ago 2026", aiMinutes: 420, seats: 4, since: "Dic 2025" },
  { id: "CE-1049", name: "Smile Studio Tucumán", city: "Tucumán", plan: "Pro", mrr: 149, status: "mora", nextCharge: "30 Jun 2026", aiMinutes: 640, seats: 5, since: "Feb 2026" },
  { id: "CE-1050", name: "Clínica Dental Patagonia", city: "Neuquén", plan: "Clínica+", mrr: 249, status: "al-dia", nextCharge: "03 Sep 2026", aiMinutes: 1290, seats: 9, since: "Abr 2026" },
];

export const growth = [
  { month: "Sep", nuevas: 3, total: 21 },
  { month: "Oct", nuevas: 4, total: 25 },
  { month: "Nov", nuevas: 2, total: 27 },
  { month: "Dic", nuevas: 5, total: 32 },
  { month: "Ene", nuevas: 6, total: 38 },
  { month: "Feb", nuevas: 4, total: 42 },
  { month: "Mar", nuevas: 7, total: 49 },
  { month: "Abr", nuevas: 5, total: 54 },
  { month: "May", nuevas: 6, total: 60 },
  { month: "Jun", nuevas: 8, total: 68 },
  { month: "Jul", nuevas: 6, total: 74 },
  { month: "Ago", nuevas: 9, total: 83 },
];

export const aiUsageMonthly = [
  { month: "Mar", minutos: 8200 },
  { month: "Abr", minutos: 9600 },
  { month: "May", minutos: 11250 },
  { month: "Jun", minutos: 12980 },
  { month: "Jul", minutos: 14310 },
  { month: "Ago", minutos: 16740 },
];

export const aiByFeature = [
  { name: "Asistente clínico", value: 42 },
  { name: "Transcripción", value: 27 },
  { name: "Resúmenes", value: 19 },
  { name: "Recordatorios", value: 12 },
];

export const paymentSummary = [
  { key: "al-dia" as PaymentStatus, label: "Al día", value: 63 },
  { key: "pendiente" as PaymentStatus, label: "Pendientes", value: 14 },
  { key: "mora" as PaymentStatus, label: "En mora", value: 6 },
];

export const activityLog = [
  { time: "Hoy 11:24", actor: "Sistema", text: "Cobro aprobado — Clínica Dental Aurora ($249)" },
  { time: "Hoy 09:02", actor: "Martín (socio)", text: "Marcó recordatorio de pago a Sonrisa Norte" },
  { time: "Ayer 18:40", actor: "Sistema", text: "Alerta: Implantes Mendoza superó 30 días de mora" },
  { time: "Ayer 15:12", actor: "Vos", text: "Cambió plan de Dental Care Córdoba a Enterprise" },
  { time: "12 Ago", actor: "Sistema", text: "Nueva clínica registrada — Smile Studio Tucumán" },
];

export const tickets = [
  { id: "#4821", clinic: "Sonrisa Norte", subject: "Error al exportar historias clínicas", priority: "Alta", status: "Abierto" },
  { id: "#4818", clinic: "OdontoSalud Palermo", subject: "Consulta de facturación", priority: "Media", status: "En curso" },
  { id: "#4810", clinic: "Dental Care Córdoba", subject: "Solicitud de usuarios extra", priority: "Baja", status: "Resuelto" },
];

export const alerts = [
  { tone: "destructive" as const, title: "2 clínicas con más de 30 días de mora", detail: "Implantes Mendoza · Smile Studio Tucumán" },
  { tone: "warning" as const, title: "Consumo de IA 118% del plan", detail: "Dental Care Córdoba superó su cupo mensual" },
  { tone: "primary" as const, title: "3 trials terminan esta semana", detail: "Seguimiento comercial recomendado" },
];

export const admins = [
  { name: "Esteban Ruiz", email: "esteban@cloudesther.com", role: "Dueño", lastAccess: "Hoy 11:40", initials: "ER" },
  { name: "Martín Alvarez", email: "martin@cloudesther.com", role: "Socio administrativo", lastAccess: "Hoy 09:02", initials: "MA" },
  { name: "Lucía Pérez", email: "lucia@cloudesther.com", role: "Socio administrativo", lastAccess: "10 Ago 2026", initials: "LP" },
];