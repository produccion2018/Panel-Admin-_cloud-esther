import { createFileRoute } from "@tanstack/react-router";

import { activityLog } from "@/components/admin/mock-data";
import { AdminShell } from "@/components/admin/shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/admin/actividad")({
  head: () => ({
    meta: [
      { title: "Logs de actividad — Cloud Esther Administración" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Registro interno de acciones del panel de administración." },
      { property: "og:title", content: "Logs de actividad — Cloud Esther" },
      { property: "og:description", content: "Panel interno." },
    ],
  }),
  component: ActivityPage,
});

function ActivityPage() {
  return (
    <AdminShell
      title="Logs de actividad"
      description="Sugerencia agregada: auditoría de acciones del panel y eventos del sistema."
    >
      <Card style={{ boxShadow: "var(--shadow-card)" }}>
        <CardHeader>
          <CardTitle>Últimos eventos</CardTitle>
          <CardDescription>Acciones de administradores y eventos automáticos</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="relative space-y-6 border-l border-border pl-6">
            {activityLog.map((e, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="font-semibold">
                    {e.actor}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{e.time}</span>
                </div>
                <p className="mt-1 text-sm">{e.text}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </AdminShell>
  );
}