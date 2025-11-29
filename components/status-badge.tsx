import { Badge } from "@/components/ui/badge"
import type { RequestStatus } from "@/lib/mock-data"

interface StatusBadgeProps {
  status: keyof RequestStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    "1": {
      label: "Solicitada",
      variant: "secondary" as const,
      className: "bg-secondary text-secondary-foreground",
    },
    "2": {
      label: "Esperando Aceptación",
      variant: "default" as const,
      className: "bg-default text-default-foreground",
    },
    "3": {
      label: "En Proceso",
      variant: "default" as const,
      className: "bg-warning text-warning-foreground",
    },
    "4": {
      label: "Terminada",
      variant: "default" as const,
      className: "bg-success text-success-foreground",
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}
