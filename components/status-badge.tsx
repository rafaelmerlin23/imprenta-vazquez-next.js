import { Badge } from "@/components/ui/badge"
import type { RequestStatus } from "@/lib/mock-data"

interface StatusBadgeProps {
  status: RequestStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    solicitada: {
      label: "Solicitada",
      variant: "secondary" as const,
    },
    esperando_aceptacion: {
      label: "Esperando Aceptación",
      variant: "default" as const,
    },
    en_proceso: {
      label: "En Proceso",
      variant: "default" as const,
      className: "bg-warning text-warning-foreground",
    },
    terminada: {
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
