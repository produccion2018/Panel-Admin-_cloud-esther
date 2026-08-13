import { Link, createFileRoute } from "@tanstack/react-router";
import { Building2, CircleDollarSign, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { KpiCard, StatusBadge } from "@/components/admin/bits";
import {
  alerts,
  clinics,
  growth,
  paymentSummary,
  aiUsageMonthly,
} from "@/components/admin/mock-data";
import { useRole } from "@/components/admin/role";
import { AdminShell } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard interno — Cloud Esther Administración" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Panel interno de superadministración de Cloud Esther." },
      { property: "og:title", content: "Cloud Esther — Administración" },
      { property: "og:description", content: "Panel interno." },
    ],
  }),
  component: AdminDashboard,
});

const statusColors: Record<string, string> = {
  "al-dia": "var(--success)",
  pendiente: "var(--warning)",
  mora: "var(--destructive)",
};

const chartTooltip = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "var(--card)",
    fontSize: 12,
  },
};

function AdminDashboard() {
  const { role } = useRole();
  const topAi = [...clinics].sort((a, b) => b.aiMinutes - a.aiMinutes).slice(0, 6);
  const maxAi = Math.max(...topAi.map((c) => c.aiMinutes));

  return (
    <AdminShell
      title="Cloud Esther — Administración"
      description="Visión general del negocio: clínicas, cobros y consumo de IA."
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/clinicas">Ver clínicas</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          accent
          label="Clínicas activas"
          value="83"
          hint="+9 nuevas este mes"
          icon={<Building2 className="h-4 w-4" />}
        />
        {role === "owner" ? (
          <KpiCard
            label="MRR"
            value="$14.870"
            hint="+12,4% vs mes anterior"
            icon={<CircleDollarSign className="h-4 w-4" />}
          />
        ) : (
          <KpiCard
            label="Cobros del mes"
            value="63 / 83"
            hint="20 clínicas sin confirmar"
            icon={<CircleDollarSign className="h-4 w-4" />}
          />
        )}
        <KpiCard
          label="Consumo IA total"
          value="16.740 min"
          hint="Agosto 2026 · +17% mensual"
          icon={<Sparkles className="h-4 w-4" />}
        />
        <KpiCard
          label="Retención"
          value="96,4%"
          hint="2 bajas en los últimos 90 días"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Crecimiento de clínicas</CardTitle>
            <CardDescription>Altas nuevas por mes y total acumulado</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growth} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip {...chartTooltip} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  name="Total clínicas"
                  dataKey="total"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fill="url(#gTotal)"
                />
                <Area
                  type="monotone"
                  name="Altas nuevas"
                  dataKey="nuevas"
                  stroke="var(--primary-glow)"
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Estado de pagos</CardTitle>
            <CardDescription>Sobre 83 clínicas activas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[190px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentSummary}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={58}
                    outerRadius={82}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {paymentSummary.map((s) => (
                      <Cell key={s.key} fill={statusColors[s.key]} />
                    ))}
                  </Pie>
                  <Tooltip {...chartTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-2">
              {paymentSummary.map((s) => (
                <div key={s.key} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: statusColors[s.key] }}
                    />
                    {s.label}
                  </span>
                  <span className="font-semibold">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Clínicas y cobranza</CardTitle>
              <CardDescription>Próximos vencimientos y estado de pago</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/clinicas">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Clínica</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="pr-6 text-right">Próximo cobro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clinics.slice(0, 6).map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="pl-6">
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.city}</p>
                    </TableCell>
                    <TableCell className="text-sm">{c.plan}</TableCell>
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

        <Card style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
            <CardDescription>Sugerencia: seguimiento automático</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((a) => (
              <div
                key={a.title}
                className="rounded-xl border border-border/70 bg-muted/40 p-3"
              >
                <p className="flex items-start gap-2 text-sm font-semibold">
                  <AlertTriangle
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{
                      color:
                        a.tone === "destructive"
                          ? "var(--destructive)"
                          : a.tone === "warning"
                            ? "var(--warning)"
                            : "var(--primary)",
                    }}
                  />
                  {a.title}
                </p>
                <p className="mt-1 pl-6 text-xs text-muted-foreground">{a.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Ranking de consumo de IA</CardTitle>
            <CardDescription>Minutos de IA usados este mes por clínica</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topAi.map((c) => (
              <div key={c.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground">
                    {c.aiMinutes.toLocaleString("es-AR")} min
                  </span>
                </div>
                <Progress value={(c.aiMinutes / maxAi) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Uso de IA en la plataforma</CardTitle>
            <CardDescription>Total mensual de minutos procesados</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aiUsageMonthly} margin={{ left: -10, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip {...chartTooltip} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="minutos" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}