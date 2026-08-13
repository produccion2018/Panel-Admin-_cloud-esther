import { createContext, useContext, useState, type ReactNode } from "react";

export type AdminRole = "owner" | "partner";

const RoleContext = createContext<{
  role: AdminRole;
  setRole: (r: AdminRole) => void;
}>({ role: "owner", setRole: () => {} });

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<AdminRole>("owner");
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}

export const roleLabel: Record<AdminRole, string> = {
  owner: "Dueño",
  partner: "Socio administrativo",
};