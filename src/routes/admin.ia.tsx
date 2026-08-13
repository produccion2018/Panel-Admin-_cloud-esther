import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { KpiCard } from "@/components/admin/bits";
import { aiByFeature, aiUsageMonthly, clinics } from "@/components/admin/mock-data";
import { AdminShell } from "@/components/admin/shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/ia")({
  head: () => ({
    meta: [
      { title: "Consumo de IA — Cloud Esther Administración" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Consumo de IA por clínica y a nivel plataforma." },
      { property: "og:title", content: "Consumo de IA — Cloud Esther" },
      { property: "og:description", content: "Panel interno." },
    ],
  }),
  component: AiPage,
});

const donutColors = ["var(--primary)", "var(--primary-glow)", "var(--chart-3)", "var(--chart-4)"];

const tooltipStyle = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "var(--card)",
    fontSize: 12,
  },
};

function AiPage() {
  const ranked = [...clinics].sort((a, b) => b.aiMinutes - a.aiMinutes);
  const total = ranked.reduce((s, c) => s + c.aiMinutes, 0);

  return (
    <AdminShell
      title="Consumo de IA"
      description="Uso de funciones de IA por clínica y en toda la plataforma."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard accent label="Minutos de IA (agosto)" value="16.740" hint="+17% vs julio" />
        <KpiCard label="Promedio por clínica" value="202 min" hint="Mediana: 168 min" />
        <KpiCard label="Clínicas sobre su cupo" value="4" hint="Facturación por excedente" />
        <KpiCard label="Consultas procesadas" value="128.400" hint="Últimos 30 días" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Evolución del uso de IA</CardTitle>
            <CardDescription>Minutos totales procesados por mes</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aiUsageMonthly} margin={{ left: -10, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip {...tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="minutos"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--primary)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Uso por función</CardTitle>
            <CardDescription>Distribución del consumo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[190px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={aiByFeature}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={82}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {aiByFeature.map((f, i) => (
                      <Cell key={f.name} fill={donutColors[i % donutColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-2">
              {aiByFeature.map((f, i) => (
                <div key={f.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: donutColors[i % donutColors.length] }}
                    />
                    {f.name}
                  </span>
                  <span className="font-semibold">{f.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card style={{ boxShadow: "var(--shadow-card)" }}>
        <CardHeader>
          <CardTitle>Ranking de clínicas por consumo</CardTitle>
          <CardDescription>Minutos de IA usados en el mes en curso</CardDescription>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ranked} layout="vertical" margin={{ left: 60, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                type="category"
                dataKey="name"
                width={150}
                tickLine={false}
                axisLine={false}
                fontSize={11}
              />
              <Tooltip {...tooltipStyle} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="aiMinutes" name="Minutos" radius={[0, 8, 8, 0]}>
                {ranked.map((c, i) => (
                  <Cell
                    key={c.id}
                    fill={i === 0 ? "var(--primary-deep)" : i < 3 ? "var(--primary)" : "var(--primary-glow)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card style={{ boxShadow: "var(--shadow-card)" }}>
        <CardHeader>
          <CardTitle>Detalle por clínica</CardTitle>
          <CardDescription>Participación sobre el total de la plataforma</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Clínica</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Minutos</TableHead>
                <TableHead>% del total</TableHead>
                <TableHead className="pr-6 text-right">Cupo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranked.map((c) => {
                const pct = (c.aiMinutes / total) * 100;
                const over = c.aiMinutes > 1500;
                return (
                  <TableRow key={c.id}>
                    <TableCell className="pl-6 font-semibold">{c.name}</TableCell>
                    <TableCell className="text-sm">{c.plan}</TableCell>
                    <TableCell className="text-sm">
                      {c.aiMinutes.toLocaleString("es-AR")}
                    </TableCell>
                    <TableCell className="text-sm">{pct.toFixed(1)}%</TableCell>
                    <TableCell className="pr-6 text-right">
                      <Badge
                        variant="outline"
                        className={
                          over
                            ? "border-warning/40 bg-warning/18 font-semibold text-warning-foreground"
                            : "border-success/25 bg-success/12 font-semibold text-success"
                        }
                      >
                        {over ? "Excedido" : "Dentro del plan"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminShell>
  );
}