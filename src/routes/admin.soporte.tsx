import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Inbox, LifeBuoy, Timer } from "lucide-react";
import { useState } from "react";

import { Cargando, KpiCard, Seccion, Vacio } from "@/components/admin/bits";
import { permisos, useRole } from "@/components/admin/role";
import { AdminShell } from "@/components/admin/shell";
import { actualizarTicket } from "@/lib/admin/api";
import { useAccion, useEquipo, useTickets } from "@/lib/admin/consultas";
import { haceCuanto } from "@/lib/admin/formato";
import type { Ticket } from "@/lib/admin/tipos";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/soporte")({
  head: () => ({
    meta: [
      { title: "Tickets de soporte — Cloud Esther Administración" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SupportPage,
});

const PRIORIDAD: Record<Ticket["prioridad"], string> = {
  Alta: "border-destructive/25 bg-destructive/10 text-destructive",
  Media: "border-warning/40 bg-warning/15 text-warning-foreground",
  Baja: "border-border bg-muted text-muted-foreground",
};
const SELECT =
  "h-8 rounded-lg border border-input bg-card px-2 text-xs font-semibold outline-none focus:border-primary/50 disabled:opacity-60";

function SupportPage() {
  const { role } = useRole();
  const { data: tickets, isLoading } = useTickets();
  const { data: equipo } = useEquipo();
  const [filtro, setFiltro] = useState<Ticket["estado"] | "Todos">("Todos");
  const cambiar = useAccion(
    (a: { id: string; c: Parameters<typeof actualizarTicket>[1] }) => actualizarTicket(a.id, a.c),
    ["tickets"],
    "Ticket actualizado",
  );
  const editable = permisos.gestionarTickets(role);
  const lista = tickets ?? [];
  const cuenta = (e: Ticket["estado"]) => lista.filter((t) => t.estado === e).length;
  const filas = lista.filter((t) => filtro === "Todos" || t.estado === filtro);

  return (
    <AdminShell
      title="Tickets de soporte"
      description="Consultas y problemas que reportan las clínicas. Asigná cada ticket a una persona del equipo y seguí su estado."
    >
      {isLoading ? (
        <Cargando />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
            <KpiCard
              accent
              label="Abiertos"
              value={String(cuenta("Abierto"))}
              hint={`${lista.filter((t) => t.estado !== "Resuelto" && t.prioridad === "Alta").length} de prioridad alta`}
              icon={<Inbox className="h-4 w-4" />}
            />
            <KpiCard
              label="En curso"
              value={String(cuenta("En curso"))}
              hint="Alguien los está resolviendo"
              icon={<Timer className="h-4 w-4" />}
            />
            <KpiCard
              label="Resueltos"
              value={String(cuenta("Resuelto"))}
              hint="Cerrados"
              icon={<CheckCircle2 className="h-4 w-4" />}
              tono="success"
            />
            <KpiCard
              label="Sin asignar"
              value={String(lista.filter((t) => t.estado !== "Resuelto" && !t.asignado).length)}
              hint="Necesitan responsable"
              icon={<LifeBuoy className="h-4 w-4" />}
              tono="warning"
            />
          </div>

          <Seccion
            titulo="Bandeja"
            descripcion={
              editable
                ? "Cambiá el estado o el responsable desde la misma fila."
                : "Solo lectura para tu perfil."
            }
            acciones={
              <div className="flex gap-1 rounded-xl bg-muted p-1">
                {(["Todos", "Abierto", "En curso", "Resuelto"] as const).map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setFiltro(e)}
                    className={cn(
                      "rounded-lg px-3 py-1 text-xs font-semibold",
                      filtro === e ? "bg-card text-primary shadow-sm" : "text-muted-foreground",
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            }
            sinPadding
          >
            {filas.length === 0 ? (
              <div className="p-5">
                <Vacio titulo="No hay tickets en este estado" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-sm">
                  <thead>
                    <tr className="bg-primary/[0.035] text-left text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      <th className="px-5 py-2.5">Ticket</th>
                      <th className="px-3 py-2.5">Prioridad</th>
                      <th className="px-3 py-2.5">Responsable</th>
                      <th className="px-5 py-2.5">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filas.map((t) => (
                      <tr key={t.id} className="border-t border-border/60">
                        <td className="px-5 py-3">
                          <p className="font-semibold">{t.asunto}</p>
                          <p className="text-xs text-muted-foreground">
                            {t.id} · {t.clinica} · {haceCuanto(t.creado)}
                          </p>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={cn(
                              "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                              PRIORIDAD[t.prioridad],
                            )}
                          >
                            {t.prioridad}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <select
                            className={SELECT}
                            disabled={!editable}
                            value={t.asignado ?? ""}
                            onChange={(e) =>
                              cambiar.mutate({ id: t.id, c: { asignado: e.target.value || null } })
                            }
                          >
                            <option value="">Sin asignar</option>
                            {(equipo ?? [])
                              .filter((a) => a.activo)
                              .map((a) => (
                                <option key={a.id} value={a.nombre}>
                                  {a.nombre}
                                </option>
                              ))}
                          </select>
                        </td>
                        <td className="px-5 py-3">
                          <select
                            className={SELECT}
                            disabled={!editable}
                            value={t.estado}
                            onChange={(e) =>
                              cambiar.mutate({
                                id: t.id,
                                c: { estado: e.target.value as Ticket["estado"] },
                              })
                            }
                          >
                            {(["Abierto", "En curso", "Resuelto"] as const).map((e) => (
                              <option key={e}>{e}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Seccion>
        </>
      )}
    </AdminShell>
  );
}
