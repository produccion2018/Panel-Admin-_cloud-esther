import { createFileRoute } from "@tanstack/react-router";

import { KpiCard } from "@/components/admin/bits";
import { tickets } from "@/components/admin/mock-data";
import { AdminShell } from "@/components/admin/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/soporte")({
  head: () => ({
    meta: [
      { title: "Tickets de soporte — Cloud Esther Administración" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Bandeja interna de tickets de soporte de clínicas." },
      { property: "og:title", content: "Soporte — Cloud Esther" },
      { property: "og:description", content: "Panel interno." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <AdminShell
      title="Tickets de soporte"
      description="Sugerencia agregada: bandeja de incidencias reportadas por las clínicas."
      actions={<Button size="sm" variant="outline">Nuevo ticket</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard accent label="Abiertos" value="8" hint="2 de prioridad alta" />
        <KpiCard label="En curso" value="5" hint="Asignados al equipo" />
        <KpiCard label="Resueltos (30d)" value="47" hint="SLA cumplido 94%" />
        <KpiCard label="Tiempo medio" value="4h 12m" hint="Primera respuesta" />
      </div>

      <Card style={{ boxShadow: "var(--shadow-card)" }}>
        <CardHeader>
          <CardTitle>Bandeja</CardTitle>
          <CardDescription>Incidencias reportadas por clínicas clientes</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Ticket</TableHead>
                <TableHead>Clínica</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead className="pr-6 text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="pl-6 font-semibold">{t.id}</TableCell>
                  <TableCell className="text-sm">{t.clinic}</TableCell>
                  <TableCell className="text-sm">{t.subject}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        t.priority === "Alta"
                          ? "border-destructive/25 bg-destructive/10 text-destructive"
                          : t.priority === "Media"
                            ? "border-warning/40 bg-warning/18 text-warning-foreground"
                            : "border-border bg-muted text-muted-foreground"
                      }
                    >
                      {t.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Badge variant="secondary">{t.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminShell>
  );
}