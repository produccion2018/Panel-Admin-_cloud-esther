import { ShieldAlert } from "lucide-react";

import { AdminShell } from "./shell";
import { Card, CardContent } from "@/components/ui/card";

export function RestrictedView() {
  return (
    <AdminShell title="Sección restringida" description="Tu rol no tiene acceso a esta sección.">
      <Card className="mx-auto max-w-lg text-center" style={{ boxShadow: "var(--shadow-card)" }}>
        <CardContent className="space-y-3 p-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <p className="text-lg font-bold">Sólo para el Dueño</p>
          <p className="text-sm text-muted-foreground">
            El rol Socio administrativo puede ver clínicas, pagos y consumo de IA, pero no la
            configuración de cuenta ni la gestión de accesos.
          </p>
        </CardContent>
      </Card>
    </AdminShell>
  );
}