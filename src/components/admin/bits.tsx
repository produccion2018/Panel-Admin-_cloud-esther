import type { ReactNode } from "react";

import { paymentLabels, type PaymentStatus } from "./mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, string> = {
    "al-dia": "bg-success/12 text-success border-success/25",
    pendiente: "bg-warning/18 text-warning-foreground border-warning/40",
    mora: "bg-destructive/10 text-destructive border-destructive/25",
  };
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-semibold", styles[status])}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "al-dia" && "bg-success",
          status === "pendiente" && "bg-warning",
          status === "mora" && "bg-destructive",
        )}
      />
      {paymentLabels[status]}
    </Badge>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  accent?: boolean;
}) {
  return (
    <Card
      className={cn("border-border/70", accent && "border-transparent text-primary-foreground")}
      style={accent ? { background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" } : { boxShadow: "var(--shadow-card)" }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className={cn("text-sm font-medium", accent ? "opacity-85" : "text-muted-foreground")}>
            {label}
          </p>
          {icon && (
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg",
                accent ? "bg-white/15" : "bg-accent text-accent-foreground",
              )}
            >
              {icon}
            </span>
          )}
        </div>
        <p className="mt-3 text-3xl font-extrabold tracking-tight">{value}</p>
        {hint && (
          <p className={cn("mt-1 text-xs", accent ? "opacity-80" : "text-muted-foreground")}>
            {hint}
          </p>
        )}
      </CardContent>
    </Card>
  );
}