import { createContext, useContext, useState, type ReactNode } from "react";

import { useSesionAdmin } from "@/lib/admin/sesion";
import type { AdminRole } from "@/lib/admin/tipos";

export type { AdminRole };

export const roleLabel: Record<AdminRole, string> = {
  owner: "Dueño",
  partner: "Socio",
  support: "Soporte técnico",
  "customer-care": "Asistente / Secretaría",
};

export const roleDescription: Record<AdminRole, string> = {
  owner: "Acceso total: negocio, importes, planes y precios, equipo y configuración.",
  partner: "Seguimiento del negocio: clínicas, demos, pagos (sin importes) e IA. Ve los planes.",
  support: "Técnico en sistemas / desarrollo: tickets, clínicas, consumo de IA y registros.",
  "customer-care": "Atención y seguimiento: demos para contactar, clínicas, pagos y tickets.",
};

export const roleInitials: Record<AdminRole, string> = {
  owner: "DU",
  partner: "SO",
  support: "ST",
  "customer-care": "AS",
};

export const ROLES: AdminRole[] = ["owner", "partner", "support", "customer-care"];

/**
 * Qué roles ven cada sección del panel.
 * Ruta que no figura acá = nadie accede (denegado por defecto).
 * IMPORTANTE: esto solo controla lo que se ve. El backend valida el rol en cada endpoint.
 */
export const sectionAccess: Record<string, AdminRole[]> = {
  "/admin": ROLES,
  "/admin/demos": ROLES,
  "/admin/clinicas": ROLES,
  "/admin/pagos": ["owner", "partner", "customer-care"],
  "/admin/planes": ["owner", "partner"],
  "/admin/ia": ["owner", "partner", "support"],
  "/admin/soporte": ROLES,
  "/admin/actividad": ["owner", "partner", "support"],
  "/admin/cuenta": ROLES,
  "/admin/accesos": ["owner"],
};

export function canAccess(role: AdminRole, path: string): boolean {
  const allowed = sectionAccess[path];
  return allowed ? allowed.includes(role) : false;
}

/** Permisos finos dentro de las secciones. */
export const permisos = {
  verImportes: (r: AdminRole) => r === "owner",
  editarPlanes: (r: AdminRole) => r === "owner",
  gestionarDemos: (r: AdminRole) => r !== "support",
  gestionarTickets: (r: AdminRole) => r === "owner" || r === "support" || r === "customer-care",
};

const RoleContext = createContext<{
  role: AdminRole;
  /** Solo en desarrollo: ver el panel como otro rol (no cambia permisos del backend). */
  setRole: (r: AdminRole | null) => void;
  vistaPrevia: boolean;
}>({ role: "owner", setRole: () => {}, vistaPrevia: false });

export function RoleProvider({ children }: { children: ReactNode }) {
  const sesion = useSesionAdmin();
  const [vista, setVista] = useState<AdminRole | null>(null);
  const propio = sesion?.usuario.rol ?? "customer-care";
  const role = import.meta.env.DEV && vista ? vista : propio;
  return (
    <RoleContext.Provider value={{ role, setRole: setVista, vistaPrevia: role !== propio }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
