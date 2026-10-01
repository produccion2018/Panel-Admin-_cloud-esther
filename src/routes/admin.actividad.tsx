import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Cargando, Seccion, Vacio } from "@/components/admin/bits";
import { RestrictedView } from "@/components/admin/restricted";
import { canAccess, useRole } from "@/components/admin/role";
import { AdminShell } from "@/components/admin/shell";
import { useActividad } from "@/lib/admin/consultas";
import { fecha } from "@/lib/admin/formato";
import type { EventoActividad } from "@/lib/admin/tipos";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/actividad")({
  head: () => ({
    meta: [
      { title: "Registro de actividad — Cloud Esther Administración" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ActivityPage,
});

const TIPOS: Record<EventoActividad["tipo"], { label: string; color: string }> = {
  acceso: { label: "Accesos", color: "bg-primary" },
  demo: { label: "Demos", color: "bg-primary-glow" },
  pago: { label: "Pagos", color: "bg-success" },
  plan: { label: "Planes", color: "bg-warning" },
  equipo: { label: "Equipo", color: "bg-primary-deep" },
  sistema: { label: "Sistema", color: "bg-muted-foreground" },
};

function ActivityPage() {
  const { role } = useRole();
  const { data, isLoading } = useActividad();
  const [tipo, setTipo] = useState<EventoActividad["tipo"] | "todos">("todos");
  if (!canAccess(role, "/admin/actividad")) return <RestrictedView />;
  const lista = (data ?? []).filter((e) => tipo === "todos" || e.tipo === tipo);

  return (
    <AdminShell
      title="Registro de actividad"
      description="Todo lo que pasa en el panel y en la plataforma: ingresos del equipo, cambios de planes, demos y pagos. Sirve de auditoría."
    >
      <Seccion
        titulo="Últimos eventos"
        acciones={
          <div className="flex flex-wrap gap-1 rounded-xl bg-muted p-1">
            {(["todos", ...Object.keys(TIPOS)] as (EventoActividad["tipo"] | "todos")[]).map(
              (t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipo(t)}
                  className={cn(
                    "rounded-lg px-3 py-1 text-xs font-semibold",
                    tipo === t ? "bg-card text-primary shadow-sm" : "text-muted-foreground",
                  )}
                >
                  {t === "todos" ? "Todos" : TIPOS[t].label}
                </button>
              ),
            )}
          </div>
        }
      >
        {isLoading ? (
          <Cargando />
        ) : lista.length === 0 ? (
          <Vacio titulo="Sin eventos" />
        ) : (
          <ol className="relative space-y-4 border-l-2 border-primary/15 pl-6">
            {lista.map((e) => (
              <li key={e.id} className="relative">
                <span
                  className={cn(
                    "absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-card",
                    TIPOS[e.tipo].color,
                  )}
                />
                <p className="text-sm font-medium">{e.accion}</p>
                <p className="text-xs text-muted-foreground">
                  {e.actor} · {fecha(e.fecha, true)} · {TIPOS[e.tipo].label}
                </p>
              </li>
            ))}
          </ol>
        )}
      </Seccion>
    </AdminShell>
  );
}
