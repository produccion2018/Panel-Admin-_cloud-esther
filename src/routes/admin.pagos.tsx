import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { KpiCard, StatusBadge } from "@/components/admin/bits";
import { clinics } from "@/components/admin/mock-data";
import { useRole } from "@/components/admin/role";
import { AdminShell } from "@/components/admin/shell";
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

export const Route = createFileRoute("/admin/pagos")({
  head: () => ({
    meta: [
      { title: "Pagos y facturación — Cloud Esther Administración" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Seguimiento interno de cobros y facturación." },
      { property: "og:title", content: "Pagos — Cloud Esther" },
      { property: "og:description", content: "Panel interno." },
    ],
  }),
  component: PaymentsPage,
});

const billing = [
  { month: "Mar", cobrado: 9200, pendiente: 1100 },
  { month: "Abr", cobrado: 10400, pendiente: 900 },
  { month: "May", cobrado: 11800, pendiente: 1300 },
  { month: "Jun", cobrado: 12600, pendiente: 800 },
  { month: "Jul", cobrado: 13750, pendiente: 1450 },
  { month: "Ago", cobrado: 14870, pendiente: 1980 },
];

function PaymentsPage() {
  const { role } = useRole();
  const owner = role === "owner";

  return (
    <AdminShell
      title={owner ? "Pagos y facturación" : "Seguimiento de pagos"}
      description={
        owner
          ? "Cobros del mes, mora y facturación de la plataforma."
          : "Quién pagó, quién falta y quién está en mora."
      }
      actions={owner ? <Button size="sm" variant="outline">Exportar facturación</Button> : undefined}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard accent label="Al día" value="63" hint="76% de la cartera" />
        <KpiCard label="Falta por pagar" value="14" hint="Vencen en los próximos 7 días" />
        <KpiCard label="En mora" value="6" hint="3 con más de 30 días" />
        {owner ? (
          <KpiCard label="Facturado en agosto" value="$14.870" hint="$1.980 por cobrar" />
        ) : (
          <KpiCard label="Recordatorios enviados" value="21" hint="Últimos 30 días" />
        )}
      </div>

      {owner && (
        <Card style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Facturación mensual</CardTitle>
            <CardDescription>Cobrado vs. pendiente por mes (USD)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={billing} margin={{ left: -10, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                  cursor={{ fill: "var(--muted)" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar name="Cobrado" dataKey="cobrado" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                <Bar
                  name="Pendiente"
                  dataKey="pendiente"
                  fill="var(--warning)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card style={{ boxShadow: "var(--shadow-card)" }}>
        <CardHeader>
          <CardTitle>Detalle de cobranza</CardTitle>
          <CardDescription>Estado por clínica y próxima fecha de cobro</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Clínica</TableHead>
                <TableHead>Plan</TableHead>
                {owner && <TableHead>Importe</TableHead>}
                <TableHead>Estado</TableHead>
                <TableHead>Próximo cobro</TableHead>
                <TableHead className="pr-6 text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clinics.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="pl-6 font-semibold">{c.name}</TableCell>
                  <TableCell className="text-sm">{c.plan}</TableCell>
                  {owner && <TableCell className="text-sm font-semibold">${c.mrr}</TableCell>}
                  <TableCell>
                    <StatusBadge status={c.status} />
                  </TableCell>
                  <TableCell className="text-sm">{c.nextCharge}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="ghost" size="sm">
                      {c.status === "al-dia" ? "Ver recibo" : "Enviar recordatorio"}
                    </Button>
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