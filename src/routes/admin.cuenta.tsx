import { createFileRoute } from "@tanstack/react-router";
import { RestrictedView } from "@/components/admin/restricted";
import { useRole } from "@/components/admin/role";
import { AdminShell } from "@/components/admin/shell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/cuenta")({
  head: () => ({
    meta: [
      { title: "Mi cuenta — Cloud Esther Administración" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Perfil y seguridad del administrador." },
      { property: "og:title", content: "Mi cuenta — Cloud Esther" },
      { property: "og:description", content: "Panel interno." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { role } = useRole();

  if (role !== "owner") return <RestrictedView />;

  return (
    <AdminShell title="Mi cuenta" description="Perfil, seguridad y preferencias del panel.">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Datos visibles para el resto del equipo interno</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-accent text-lg font-bold text-accent-foreground">
                  ER
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Cambiar foto
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" defaultValue="Esteban" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input id="apellido" defaultValue="Ruiz" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="esteban@cloudesther.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tel">Teléfono</Label>
                <Input id="tel" defaultValue="+54 11 5555 1234" />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <p className="text-sm font-semibold">Cambiar contraseña</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="p1">Actual</Label>
                  <Input id="p1" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p2">Nueva</Label>
                  <Input id="p2" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p3">Repetir</Label>
                  <Input id="p3" type="password" placeholder="••••••••" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancelar</Button>
              <Button>Guardar cambios</Button>
            </div>
          </CardContent>
        </Card>

        <Card style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Seguridad</CardTitle>
            <CardDescription>Preferencias del acceso interno</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { t: "Verificación en dos pasos", d: "Código por app autenticadora" },
              { t: "Alertas de acceso", d: "Aviso por email en cada login" },
              { t: "Cerrar sesión a los 30 min", d: "Inactividad en el panel" },
              { t: "Resumen semanal", d: "Reporte de negocio los lunes" },
            ].map((s, i) => (
              <div key={s.t} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{s.t}</p>
                  <p className="text-xs text-muted-foreground">{s.d}</p>
                </div>
                <Switch defaultChecked={i !== 2} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
