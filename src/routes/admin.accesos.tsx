import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";

import { admins } from "@/components/admin/mock-data";
import { RestrictedView } from "@/components/admin/restricted";
import { useRole } from "@/components/admin/role";
import { AdminShell } from "@/components/admin/shell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/accesos")({
  head: () => ({
    meta: [
      { title: "Gestión de accesos — Cloud Esther Administración" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Administradores con acceso al panel interno." },
      { property: "og:title", content: "Gestión de accesos — Cloud Esther" },
      { property: "og:description", content: "Panel interno." },
    ],
  }),
  component: AccessPage,
});

function AccessPage() {
  const { role } = useRole();
  if (role !== "owner") return <RestrictedView />;

  return (
    <AdminShell
      title="Gestión de accesos"
      description="Quién puede entrar al panel de superadministración."
      actions={<InviteDialog />}
    >
      <Card style={{ boxShadow: "var(--shadow-card)" }}>
        <CardHeader>
          <CardTitle>Administradores</CardTitle>
          <CardDescription>Sólo estas personas pueden acceder a /admin</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Persona</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Último acceso</TableHead>
                <TableHead className="pr-6 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((a) => (
                <TableRow key={a.email}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-accent text-xs font-bold text-accent-foreground">
                          {a.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{a.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        a.role === "Dueño"
                          ? "border-primary/30 bg-primary/10 font-semibold text-primary"
                          : "font-semibold"
                      }
                    >
                      {a.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.lastAccess}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={a.role === "Dueño"}
                    >
                      Revocar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card style={{ boxShadow: "var(--shadow-card)" }}>
        <CardHeader>
          <CardTitle>Permisos por rol</CardTitle>
          <CardDescription>Qué ve cada rol dentro de este panel</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Sección</TableHead>
                <TableHead>Dueño</TableHead>
                <TableHead className="pr-6">Socio administrativo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["Dashboard general", true, true],
                ["Clínicas clientes", true, true],
                ["Estado de pagos", true, true],
                ["Facturación e importes", true, false],
                ["Consumo de IA", true, true],
                ["Tickets y logs", true, true],
                ["Mi cuenta / configuración", true, false],
                ["Gestión de accesos", true, false],
              ].map(([s, o, p]) => (
                <TableRow key={s as string}>
                  <TableCell className="pl-6 font-medium">{s as string}</TableCell>
                  <TableCell>{o ? <Yes /> : <No />}</TableCell>
                  <TableCell className="pr-6">{p ? <Yes /> : <No />}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminShell>
  );
}

function Yes() {
  return <span className="text-sm font-semibold text-success">Sí</span>;
}
function No() {
  return <span className="text-sm font-semibold text-muted-foreground">No</span>;
}

function InviteDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="mr-1.5 h-4 w-4" /> Invitar administrador
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitar administrador</DialogTitle>
          <DialogDescription>
            Se enviará un acceso al panel interno de Cloud Esther.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="iname">Nombre</Label>
            <Input id="iname" placeholder="Martín Alvarez" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="iemail">Email</Label>
            <Input id="iemail" placeholder="socio@cloudesther.com" />
          </div>
          <div className="space-y-2">
            <Label>Rol</Label>
            <Select defaultValue="partner">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Dueño (acceso total)</SelectItem>
                <SelectItem value="partner">Socio administrativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full sm:w-auto">Enviar invitación</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}