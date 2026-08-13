import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Sparkles,
  LifeBuoy,
  ScrollText,
  Settings,
  ShieldCheck,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { BrandMark } from "./logo";
import { useRole, roleLabel, type AdminRole } from "./role";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: LucideIcon; ownerOnly?: boolean };

const nav: { section: string; items: NavItem[] }[] = [
  {
    section: "Negocio",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/clinicas", label: "Clínicas clientes", icon: Building2 },
      { to: "/admin/pagos", label: "Pagos y facturación", icon: CreditCard },
      { to: "/admin/ia", label: "Consumo de IA", icon: Sparkles },
    ],
  },
  {
    section: "Operación",
    items: [
      { to: "/admin/soporte", label: "Tickets de soporte", icon: LifeBuoy },
      { to: "/admin/actividad", label: "Logs de actividad", icon: ScrollText },
    ],
  },
  {
    section: "Sistema",
    items: [
      { to: "/admin/cuenta", label: "Mi cuenta", icon: Settings, ownerOnly: true },
      { to: "/admin/accesos", label: "Gestión de accesos", icon: ShieldCheck, ownerOnly: true },
    ],
  },
];

export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { role, setRole } = useRole();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="border-b border-sidebar-border px-5 py-5">
          <BrandMark subtitle="Administración" />
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {nav.map((group) => {
            const items = group.items.filter((i) => !(i.ownerOnly && role !== "owner"));
            if (!items.length) return null;
            return (
              <div key={group.section}>
                <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/45">
                  {group.section}
                </p>
                <div className="space-y-1">
                  {items.map((item) => {
                    const active =
                      item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-sidebar-accent text-xs text-sidebar-accent-foreground">
                {role === "owner" ? "ER" : "MA"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-semibold">
                {role === "owner" ? "Esteban Ruiz" : "Martín Alvarez"}
              </p>
              <p className="truncate text-[11px] text-sidebar-foreground/60">{roleLabel[role]}</p>
            </div>
            <Link to="/admin/login" className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-border bg-card/85 backdrop-blur">
          <div className="flex flex-wrap items-center gap-4 px-6 py-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-xl font-bold tracking-tight">{title}</h1>
                <Badge className="border-transparent bg-accent text-accent-foreground">
                  Panel interno
                </Badge>
              </div>
              {description && (
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {actions}
              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-xs text-muted-foreground">Vista de rol</span>
                <Select value={role} onValueChange={(v) => setRole(v as AdminRole)}>
                  <SelectTrigger className="h-9 w-[210px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Dueño (acceso total)</SelectItem>
                    <SelectItem value="partner">Socio administrativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/login">Salir</Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 px-6 py-6">
          <div className="mx-auto w-full max-w-[1400px] space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}