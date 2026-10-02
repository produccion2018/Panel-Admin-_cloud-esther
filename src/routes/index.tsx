import { createFileRoute, redirect } from "@tanstack/react-router";

/* Este proyecto es solo el panel del dueño de Cloud Esther (no es la web pública ni el SaaS).
   Entrar a la dirección del panel lleva directo a /admin: si no hay sesión, al login. */
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/admin" });
  },
});
