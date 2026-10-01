import { Navigate, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { RoleProvider } from "@/components/admin/role";
import { Toaster } from "@/components/ui/sonner";
import {
  INACTIVIDAD_MS,
  cerrarSesionAdmin,
  inactivoDesde,
  marcarActividad,
  useSesionAdmin,
} from "@/lib/admin/sesion";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

/** Pantallas que se ven sin sesión. */
const PUBLICAS = ["/admin/login", "/admin/recuperar", "/admin/restablecer"];

function AdminLayout() {
  const sesion = useSesionAdmin();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const publica = PUBLICAS.some((p) => pathname.startsWith(p));
  // La sesión vive en el navegador: hasta montar no se sabe si hay una.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  // Cierre por inactividad (30 minutos sin usar el panel).
  useEffect(() => {
    if (!sesion) return;
    let ultimo = 0;
    const actividad = () => {
      const ahora = Date.now();
      if (ahora - ultimo > 15_000) {
        ultimo = ahora;
        marcarActividad();
      }
    };
    const eventos = ["pointerdown", "keydown", "scroll", "mousemove"] as const;
    eventos.forEach((e) => window.addEventListener(e, actividad, { passive: true }));
    const t = window.setInterval(() => {
      if (Date.now() - inactivoDesde() > INACTIVIDAD_MS) cerrarSesionAdmin("inactividad");
    }, 30_000);
    return () => {
      eventos.forEach((e) => window.removeEventListener(e, actividad));
      window.clearInterval(t);
    };
  }, [sesion]);

  if (!montado) return <div className="min-h-screen bg-background" />;
  if (!sesion && !publica) return <Navigate to="/admin/login" replace />;
  if (sesion && pathname.startsWith("/admin/login")) return <Navigate to="/admin" replace />;

  return (
    <RoleProvider>
      <Outlet />
      <Toaster position="top-right" richColors closeButton />
    </RoleProvider>
  );
}
