import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import * as api from "./api";

/* Ubicación: src/lib/admin/consultas.ts
   Hooks de datos (React Query) sobre src/lib/admin/api.ts. Cachean y refrescan cada sección. */

export const useEquipo = () => useQuery({ queryKey: ["equipo"], queryFn: api.obtenerEquipo });
export const usePlanes = () => useQuery({ queryKey: ["planes"], queryFn: api.obtenerPlanes });
export const useClinicas = () => useQuery({ queryKey: ["clinicas"], queryFn: api.obtenerClinicas });
export const useDemos = () =>
  useQuery({ queryKey: ["demos"], queryFn: api.obtenerDemos, refetchInterval: 60_000 });
export const useTickets = () => useQuery({ queryKey: ["tickets"], queryFn: api.obtenerTickets });
export const useActividad = () =>
  useQuery({ queryKey: ["actividad"], queryFn: api.obtenerActividad });
export const useConsumoIA = () =>
  useQuery({ queryKey: ["consumo-ia"], queryFn: api.obtenerConsumoIA });
export const useCrecimiento = () =>
  useQuery({ queryKey: ["crecimiento"], queryFn: api.obtenerCrecimiento });

/** Mutación con aviso y refresco de las listas afectadas. */
export function useAccion<A, R = unknown>(
  fn: (a: A) => Promise<R>,
  claves: string[],
  mensaje?: string | ((a: A) => string),
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (_r, a) => {
      [...claves, "actividad"].forEach((k) => void qc.invalidateQueries({ queryKey: [k] }));
      if (mensaje) toast.success(typeof mensaje === "function" ? mensaje(a) : mensaje);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo guardar."),
  });
}
