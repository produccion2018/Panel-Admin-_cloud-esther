import { createContext, useContext, useState, type ReactNode } from "react";

export type AdminRole = "owner" | "partner" | "support" | "customer-care";

export const roleLabel: Record<AdminRole, string> = {
  owner: "Dueño",
  partner: "Socio administrativo",
  support: "Soporte técnico",
  "customer-care": "Atención al cliente",
};

export const roleInitials: Record<AdminRole, string> = {
  owner: "DU",
  partner: "SA",
  support: "ST",
  "customer-care": "AC",
};

const ALL_ROLES: AdminRole[] = ["owner", "partner", "support", "customer-care"];

/**
 * Qué roles ven cada sección del panel.
 * Ruta que no figura acá = nadie accede (denegado por defecto).
 * IMPORTANTE: esto solo controla lo que se ve en el frontend. Cuando conectes el
 * backend, cada endpoint tiene que validar el rol también en el servidor.
 */
export const sectionAccess: Record<string, AdminRole[]> = {
  "/admin": ALL_ROLES,
  "/admin/clinicas": ALL_ROLES,
  "/admin/pagos": ["owner", "partner", "customer-care"],
  "/admin/ia": ["owner", "partner"],
  "/admin/soporte": ALL_ROLES,
  "/admin/actividad": ["owner", "partner", "support"],
  "/admin/cuenta": ["owner"],
  "/admin/accesos": ["owner"],
};

export function canAccess(role: AdminRole, path: string): boolean {
  const allowed = sectionAccess[path];
  return allowed ? allowed.includes(role) : false;
}

const RoleContext = createContext<{
  role: AdminRole;
  setRole: (r: AdminRole) => void;
}>({ role: "owner", setRole: () => {} });

export function RoleProvider({ children }: { children: ReactNode }) {
  // TODO backend: el rol inicial tiene que salir de la sesión del usuario logueado.
  const [role, setRole] = useState<AdminRole>("owner");
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}