import { Link, createFileRoute } from "@tanstack/react-router";
import { KeyRound, Lock, ShieldCheck, User } from "lucide-react";

import { ToothLogo } from "@/components/admin/logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Acceso interno — Cloud Esther Administración" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Acceso restringido al panel de administración interna." },
      { property: "og:title", content: "Acceso interno — Cloud Esther" },
      { property: "og:description", content: "Acceso restringido." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <div
        className="relative hidden flex-col justify-between p-12 text-primary-foreground lg:flex"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <ToothLogo className="h-7 w-7" />
          </div>
          <div className="leading-tight">
            <p className="text-lg font-extrabold tracking-tight">Cloud Esther</p>
            <p className="text-xs uppercase tracking-[0.18em] opacity-80">Administración</p>
          </div>
        </div>
        <div className="max-w-md space-y-4">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
            Panel interno de superadministración
          </h2>
          <p className="text-sm leading-relaxed opacity-85">
            Control del negocio: clínicas suscriptas, cobros, planes y consumo de IA de toda la
            plataforma. Este acceso no es el panel de las clínicas clientes.
          </p>
        </div>
        <p className="flex items-center gap-2 text-xs opacity-75">
          <ShieldCheck className="h-4 w-4" /> Acceso restringido y auditado
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-3 lg:hidden">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              <ToothLogo className="h-8 w-8" />
            </div>
            <p className="text-lg font-extrabold tracking-tight">Cloud Esther</p>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight">Ingreso de administradores</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sólo para el equipo interno de Cloud Esther.
          </p>

          <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="user">Usuario</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="user" placeholder="esteban@cloudesther.com" className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pass">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="pass" type="password" placeholder="••••••••••" className="pl-9" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox id="remember" /> Recordarme
              </label>
              <ChangePasswordDialog />
            </div>
            <Button className="w-full" size="lg" asChild>
              <Link to="/admin">Entrar al panel</Link>
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Maqueta visual — sin autenticación real conectada.
          </p>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="text-sm font-semibold text-primary hover:underline">
          Cambiar contraseña
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" /> Cambiar contraseña
          </DialogTitle>
          <DialogDescription>
            Definí una nueva contraseña para tu acceso de administración.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="cur">Contraseña actual</Label>
            <Input id="cur" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new">Nueva contraseña</Label>
            <Input id="new" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rep">Repetir nueva contraseña</Label>
            <Input id="rep" type="password" placeholder="••••••••" />
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full sm:w-auto">Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}