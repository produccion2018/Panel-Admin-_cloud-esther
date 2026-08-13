import { createFileRoute } from "@tanstack/react-router";

import { ToothLogo } from "@/components/admin/logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cloud Esther — Software en la nube para clínicas dentales" },
      {
        name: "description",
        content:
          "Cloud Esther centraliza agenda, historias clínicas y asistencia con IA para clínicas dentales.",
      },
      { property: "og:title", content: "Cloud Esther — Software para clínicas dentales" },
      {
        property: "og:description",
        content: "Agenda, historias clínicas y asistencia con IA en una sola plataforma.",
      },
    ],
  }),
  component: Index,
});

// Sitio público. No debe contener ningún enlace al panel interno (/admin).
function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl text-primary-foreground"
        style={{ background: "var(--gradient-primary)" }}
      >
        <ToothLogo className="h-9 w-9" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Cloud Esther</h1>
      <p className="max-w-md text-muted-foreground">
        Software en la nube para clínicas dentales: agenda, historias clínicas y asistencia con IA.
      </p>
    </div>
  );
}
