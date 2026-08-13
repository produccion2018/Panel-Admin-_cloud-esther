import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { KpiCard, StatusBadge } from "@/components/admin/bits";
import { clinics } from "@/components/admin/mock-data";
import { useRole } from "@/components/admin/role";
import { AdminShell } from "@/components/admin/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/clinicas")({
  head: () => ({
    meta: [
      { title: "Clínicas clientes — Cloud Esther Administración" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Listado interno de clínicas suscriptas a Cloud Esther." },
      { property: "og:title", content: "Clínicas clientes — Cloud Esther" },
      { property: "og:description", content: "Panel interno." },
    ],
  }),
  component: ClinicsPage,
});

function ClinicsPage() {
  const { role } = useRole();

  return (
    <AdminShell
      title="Clínicas clientes"
      description="Todas las cuentas suscriptas a Cloud Esther."
      actions={role === "owner" ? <Button size="sm">Nueva clínica</Button> : undefined}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Activas" value="83" hint="En 14 provincias" />
        <KpiCard label="En trial" value="7" hint="3 terminan esta semana" />
        <KpiCard label="Usuarios totales" value="642" hint="Promedio 7,7 por clínica" />
        <KpiCard label="Bajas 90 días" value="2" hint="Churn 2,4%" />
      </div>

      <Card style={{ boxShadow: "var(--shadow-card)" }}>
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Listado de clínicas</CardTitle>
              <CardDescription>Plan, estado de pago y próxima fecha de cobro</CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar clínica…" className="pl-9" />
            </div>
          </div>
          <Tabs defaultValue="todas">
            <TabsList>
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="al-dia">Al día</TabsTrigger>
              <TabsTrigger value="pendiente">Falta por pagar</TabsTrigger>
              <TabsTrigger value="mora">En mora</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Clínica</TableHead>
                <TableHead>Plan</TableHead>
                {role === "owner" && <TableHead>Mensualidad</TableHead>}
                <TableHead>Usuarios</TableHead>
                <TableHead>Consumo IA</TableHead>
                <TableHead>Estado de pago</TableHead>
                <TableHead className="pr-6 text-right">Próximo cobro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clinics.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="pl-6">
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.id} · {c.city} · Cliente desde {c.since}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-semibold">
                      {c.plan}
                    </Badge>
                  </TableCell>
                  {role === "owner" && (
                    <TableCell className="text-sm font-semibold">${c.mrr}/mes</TableCell>
                  )}
                  <TableCell className="text-sm">{c.seats}</TableCell>
                  <TableCell className="text-sm">
                    {c.aiMinutes.toLocaleString("es-AR")} min
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={c.status} />
                  </TableCell>
                  <TableCell className="pr-6 text-right text-sm">{c.nextCharge}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminShell>
  );
}