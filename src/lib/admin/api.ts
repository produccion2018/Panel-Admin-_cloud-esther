import {
  ACTIVIDAD_INICIAL,
  ADMINS_INICIALES,
  CLAVES_PRUEBA,
  CLINICAS_INICIALES,
  CONSUMO_IA_INICIAL,
  CRECIMIENTO_INICIAL,
  DEMOS_INICIALES,
  PLANES_INICIALES,
  TICKETS_INICIALES,
} from "./datos-ejemplo";
import { leerSesion } from "./sesion";
import type {
  AdminRole,
  AdminUser,
  Clinica,
  ConsumoIAMensual,
  CuentaDemo,
  EventoActividad,
  PlanConfig,
  PlanId,
  SesionAdmin,
  Ticket,
} from "./tipos";

/* Ubicación: src/lib/admin/api.ts
   Única puerta de datos del panel. Todas las pantallas usan estas funciones.

   ─── Con backend ───
   Configurar VITE_ADMIN_API_URL (por ejemplo https://api.cloudesther.com). Cada función llama al
   endpoint indicado con el token de la sesión (Authorization: Bearer <token>). El backend SIEMPRE
   valida el rol: el panel solo oculta lo que cada rol no debe ver.

   CONTRATO (lo que tiene que implementar el backend)
   POST   /admin/auth/login              { email, clave }            → SesionAdmin
   POST   /admin/auth/logout
   POST   /admin/auth/recuperar          { email }                   → 204 (envía el enlace por correo)
   POST   /admin/auth/restablecer        { token, clave }            → 204
   POST   /admin/auth/cambiar-clave      { actual, nueva }           → 204
   PATCH  /admin/perfil                  { nombre, telefono }        → AdminUser
   GET    /admin/equipo                                              → AdminUser[]
   POST   /admin/equipo                  { nombre, email, rol }      → AdminUser (envía invitación)
   PATCH  /admin/equipo/:id              { rol?, activo? }           → AdminUser
   GET    /admin/planes                                              → PlanConfig[]
   PUT    /admin/planes/:id              Partial<PlanConfig>         → PlanConfig  (lo lee la web y la app)
   GET    /admin/clinicas                                            → Clinica[]
   POST   /admin/clinicas/:id/recordatorio                           → 204 (aviso de pago por correo/WhatsApp)
   GET    /admin/demos                                               → CuentaDemo[]
   PATCH  /admin/demos/:id               { estado?, notas?, responsable? } → CuentaDemo
   POST   /demo/eventos                  (lo envía la app del demo: registro, ingreso, módulo,
                                          plan, cierre, expiración) → el backend arma CuentaDemo
   GET    /admin/tickets                                             → Ticket[]
   PATCH  /admin/tickets/:id             { estado?, asignado? }      → Ticket
   GET    /admin/actividad                                           → EventoActividad[]
   GET    /admin/ia/mensual                                          → ConsumoIAMensual[]
   GET    /admin/clinicas/crecimiento                                → { mes, nuevas, total }[]

   ─── Sin backend (ahora) ───
   Funciona con DATOS DE EJEMPLO guardados en este navegador, para revisar el panel completo.
   El panel lo indica con la etiqueta «Datos de ejemplo». */

const API_URL = (import.meta.env["VITE_ADMIN_API_URL"] as string | undefined)?.replace(/\/$/, "");
export const CON_BACKEND = Boolean(API_URL);

export class ErrorApi extends Error {}

async function http<T>(metodo: string, ruta: string, cuerpo?: unknown): Promise<T> {
  const token = leerSesion()?.token;
  const r = await fetch(`${API_URL}${ruta}`, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(cuerpo !== undefined ? { body: JSON.stringify(cuerpo) } : {}),
  });
  if (!r.ok) {
    const texto = await r.text().catch(() => "");
    throw new ErrorApi(texto || `Error ${r.status}`);
  }
  return (r.status === 204 ? undefined : await r.json()) as T;
}

/* ───────────── Base local (modo sin backend) ───────────── */

type BaseLocal = {
  version: 1;
  admins: AdminUser[];
  claves: Record<string, string>; // email → hash
  planes: PlanConfig[];
  clinicas: Clinica[];
  demos: CuentaDemo[];
  tickets: Ticket[];
  actividad: EventoActividad[];
  recuperaciones: { token: string; email: string; vence: number }[];
};

const KEY = "cloud-esther-admin:datos";
let base: BaseLocal | null = null;

async function hash(texto: string) {
  const datos = new TextEncoder().encode(`cloud-esther-admin:${texto}`);
  const digest = await crypto.subtle.digest("SHA-256", datos);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function db(): Promise<BaseLocal> {
  if (base) return base;
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
    if (raw) {
      base = JSON.parse(raw) as BaseLocal;
      return base;
    }
  } catch {
    /* se regenera */
  }
  const claves: Record<string, string> = {};
  for (const [email, clave] of Object.entries(CLAVES_PRUEBA)) claves[email] = await hash(clave);
  base = {
    version: 1,
    admins: ADMINS_INICIALES,
    claves,
    planes: PLANES_INICIALES,
    clinicas: CLINICAS_INICIALES,
    demos: DEMOS_INICIALES,
    tickets: TICKETS_INICIALES,
    actividad: ACTIVIDAD_INICIAL,
    recuperaciones: [],
  };
  guardar();
  return base;
}

function guardar() {
  try {
    if (base) window.localStorage.setItem(KEY, JSON.stringify(base));
  } catch {
    /* sin almacenamiento */
  }
}

/** Copia para que las pantallas nunca compartan objetos con la base local. */
const copia = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

const espera = () => new Promise((r) => setTimeout(r, 250));
const nuevoId = (p: string) =>
  `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

async function registrar(accion: string, tipo: EventoActividad["tipo"]) {
  const b = await db();
  const actor = leerSesion()?.usuario.nombre ?? "Sistema";
  b.actividad = [
    { id: nuevoId("a"), fecha: new Date().toISOString(), actor, accion, tipo },
    ...b.actividad,
  ].slice(0, 300);
  guardar();
}

/** Borra los datos de ejemplo guardados en este navegador (vuelven los iniciales). */
export function reiniciarDatosEjemplo() {
  base = null;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* sin almacenamiento */
  }
}

/* ───────────── Autenticación ───────────── */

export async function iniciarSesionAdmin(email: string, clave: string): Promise<SesionAdmin> {
  const correo = email.trim().toLowerCase();
  if (CON_BACKEND) return http<SesionAdmin>("POST", "/admin/auth/login", { email: correo, clave });
  await espera();
  const b = await db();
  const usuario = b.admins.find((a) => a.email === correo);
  if (!usuario || b.claves[correo] !== (await hash(clave)))
    throw new ErrorApi("El correo o la contraseña no son correctos.");
  if (!usuario.activo) throw new ErrorApi("Tu acceso está desactivado. Hablá con el Dueño.");
  usuario.ultimoAcceso = new Date().toISOString();
  guardar();
  const sesion: SesionAdmin = { usuario, token: nuevoId("local"), inicio: usuario.ultimoAcceso };
  await registrar("Ingresó al panel", "acceso");
  return sesion;
}

/** Devuelve el enlace solo en modo sin backend (para poder probar sin correo). */
export async function solicitarRecuperacion(email: string): Promise<{ enlacePrueba?: string }> {
  const correo = email.trim().toLowerCase();
  if (CON_BACKEND) {
    await http("POST", "/admin/auth/recuperar", { email: correo });
    return {};
  }
  await espera();
  const b = await db();
  // Por seguridad la respuesta es la misma exista o no el correo.
  if (!b.admins.some((a) => a.email === correo)) return {};
  const token = nuevoId("rec") + nuevoId("x");
  b.recuperaciones = [
    ...b.recuperaciones.filter((r) => r.email !== correo),
    { token, email: correo, vence: Date.now() + 30 * 60 * 1000 },
  ];
  guardar();
  return { enlacePrueba: `/admin/restablecer?token=${token}` };
}

export async function restablecerClave(token: string, clave: string) {
  if (CON_BACKEND) return http<void>("POST", "/admin/auth/restablecer", { token, clave });
  await espera();
  const b = await db();
  const rec = b.recuperaciones.find((r) => r.token === token);
  if (!rec || rec.vence < Date.now())
    throw new ErrorApi("El enlace venció o ya se usó. Pedí uno nuevo.");
  b.claves[rec.email] = await hash(clave);
  b.recuperaciones = b.recuperaciones.filter((r) => r.token !== token);
  guardar();
}

export async function cambiarClave(actual: string, nueva: string) {
  if (CON_BACKEND) return http<void>("POST", "/admin/auth/cambiar-clave", { actual, nueva });
  await espera();
  const b = await db();
  const email = leerSesion()?.usuario.email ?? "";
  if (b.claves[email] !== (await hash(actual)))
    throw new ErrorApi("La contraseña actual no es correcta.");
  b.claves[email] = await hash(nueva);
  guardar();
  await registrar("Cambió su contraseña", "acceso");
}

/** Reglas mínimas de contraseña (las mismas que debe validar el backend). */
export function problemaClave(clave: string): string | null {
  if (clave.length < 10) return "Usá al menos 10 caracteres.";
  if (!/[A-Z]/.test(clave) || !/[a-z]/.test(clave)) return "Combiná mayúsculas y minúsculas.";
  if (!/[0-9]/.test(clave)) return "Agregá al menos un número.";
  return null;
}

export async function actualizarPerfil(datos: { nombre: string; telefono: string }) {
  if (CON_BACKEND) return http<AdminUser>("PATCH", "/admin/perfil", datos);
  await espera();
  const b = await db();
  const id = leerSesion()?.usuario.id;
  const u = b.admins.find((a) => a.id === id);
  if (!u) throw new ErrorApi("No se encontró tu usuario.");
  Object.assign(u, datos);
  guardar();
  return copia(u);
}

/* ───────────── Equipo interno ───────────── */

export async function obtenerEquipo(): Promise<AdminUser[]> {
  if (CON_BACKEND) return http("GET", "/admin/equipo");
  return copia((await db()).admins);
}

export async function invitarAdmin(datos: {
  nombre: string;
  email: string;
  rol: AdminRole;
}): Promise<{ usuario: AdminUser; clavePrueba?: string }> {
  if (CON_BACKEND) return { usuario: await http<AdminUser>("POST", "/admin/equipo", datos) };
  await espera();
  const b = await db();
  const email = datos.email.trim().toLowerCase();
  if (b.admins.some((a) => a.email === email))
    throw new ErrorApi("Ese correo ya tiene acceso al panel.");
  const usuario: AdminUser = {
    id: nuevoId("adm"),
    nombre: datos.nombre.trim(),
    email,
    telefono: "",
    rol: datos.rol,
    activo: true,
    ultimoAcceso: null,
    creado: new Date().toISOString(),
  };
  const clavePrueba = `Temporal${Math.floor(1000 + Math.random() * 9000)}`;
  b.admins = [...b.admins, usuario];
  b.claves[email] = await hash(clavePrueba);
  guardar();
  await registrar(`Dio acceso a ${usuario.nombre}`, "equipo");
  return { usuario, clavePrueba };
}

export async function actualizarAdmin(id: string, cambios: { rol?: AdminRole; activo?: boolean }) {
  if (CON_BACKEND) return http<AdminUser>("PATCH", `/admin/equipo/${id}`, cambios);
  await espera();
  const b = await db();
  const u = b.admins.find((a) => a.id === id);
  if (!u) throw new ErrorApi("Usuario no encontrado.");
  if (u.rol === "owner" && cambios.activo === false)
    throw new ErrorApi("No se puede desactivar al Dueño.");
  Object.assign(u, cambios);
  guardar();
  await registrar(
    cambios.activo === false
      ? `Quitó el acceso de ${u.nombre}`
      : `Actualizó el acceso de ${u.nombre}`,
    "equipo",
  );
  return u;
}

/* ───────────── Planes ───────────── */

export async function obtenerPlanes(): Promise<PlanConfig[]> {
  if (CON_BACKEND) return http("GET", "/admin/planes");
  return copia((await db()).planes);
}

export async function guardarPlan(
  id: PlanId,
  cambios: Partial<Omit<PlanConfig, "id" | "nombre" | "odontograma">>,
) {
  if (CON_BACKEND) return http<PlanConfig>("PUT", `/admin/planes/${id}`, cambios);
  await espera();
  const b = await db();
  const p = b.planes.find((x) => x.id === id);
  if (!p) throw new ErrorApi("Plan no encontrado.");
  Object.assign(p, cambios);
  guardar();
  await registrar(`Actualizó el plan ${p.nombre}`, "plan");
  return p;
}

/* ───────────── Clínicas, demos y operación ───────────── */

export async function obtenerClinicas(): Promise<Clinica[]> {
  if (CON_BACKEND) return http("GET", "/admin/clinicas");
  return copia((await db()).clinicas);
}

export async function enviarRecordatorioPago(id: string) {
  if (CON_BACKEND) return http<void>("POST", `/admin/clinicas/${id}/recordatorio`);
  await espera();
  const c = (await db()).clinicas.find((x) => x.id === id);
  await registrar(`Envió recordatorio de pago a ${c?.nombre ?? id}`, "pago");
}

export async function obtenerDemos(): Promise<CuentaDemo[]> {
  if (CON_BACKEND) return http("GET", "/admin/demos");
  return copia((await db()).demos);
}

export async function actualizarDemo(
  id: string,
  cambios: Partial<Pick<CuentaDemo, "estado" | "notas" | "responsable">>,
) {
  if (CON_BACKEND) return http<CuentaDemo>("PATCH", `/admin/demos/${id}`, cambios);
  await espera();
  const b = await db();
  const d = b.demos.find((x) => x.id === id);
  if (!d) throw new ErrorApi("Demo no encontrada.");
  Object.assign(d, cambios);
  guardar();
  if (cambios.estado)
    await registrar(`Marcó la demo de ${d.clinica} como «${cambios.estado}»`, "demo");
  return d;
}

export async function obtenerTickets(): Promise<Ticket[]> {
  if (CON_BACKEND) return http("GET", "/admin/tickets");
  return copia((await db()).tickets);
}

export async function actualizarTicket(
  id: string,
  cambios: Partial<Pick<Ticket, "estado" | "asignado">>,
) {
  if (CON_BACKEND) return http<Ticket>("PATCH", `/admin/tickets/${id}`, cambios);
  await espera();
  const b = await db();
  const t = b.tickets.find((x) => x.id === id);
  if (!t) throw new ErrorApi("Ticket no encontrado.");
  Object.assign(t, cambios);
  guardar();
  return t;
}

export async function obtenerActividad(): Promise<EventoActividad[]> {
  if (CON_BACKEND) return http("GET", "/admin/actividad");
  return copia((await db()).actividad);
}

export async function obtenerConsumoIA(): Promise<ConsumoIAMensual[]> {
  if (CON_BACKEND) return http("GET", "/admin/ia/mensual");
  return CONSUMO_IA_INICIAL;
}

export async function obtenerCrecimiento(): Promise<
  { mes: string; nuevas: number; total: number }[]
> {
  if (CON_BACKEND) return http("GET", "/admin/clinicas/crecimiento");
  return CRECIMIENTO_INICIAL;
}
