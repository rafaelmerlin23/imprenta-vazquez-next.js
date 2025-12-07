import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/app/stores/useAppStore"

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { currentLoginInfoUser: user } = useAppStore()
  const statusConfig = {
    "pending": {
      label: "Pendiente",
      variant: "outline" as const,
      className: "bg-gray-100 text-gray-700 border-gray-300",
    },
    "waiting_acceptance": {
      label: !user?.isAdmin ? "Esperando aceptación" : "Solicitada",
      variant: "secondary" as const,
      className: "bg-blue-100 text-blue-700 border-blue-300",
    },
    "accepted": {
      label: "Aceptada",
      variant: "default" as const,
      className: "bg-green-100 text-green-700 border-green-300",
    },
    "in_progress": {
      label: "En proceso",
      variant: "default" as const,
      className: "bg-yellow-100 text-yellow-700 border-yellow-300",
    },
    "completed": {
      label: "Completada",
      variant: "default" as const,
      className: "bg-emerald-100 text-emerald-700 border-emerald-300",
    },
    "rejected": {
      label: "Rechazada",
      variant: "destructive" as const,
      className: "bg-red-100 text-red-700 border-red-300",
    },
    "declined": {
      label: "Denegada",
      variant: "destructive" as const,
      className: "bg-red-100 text-red-700 border-red-300",
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: "Desconocido",
    variant: "outline" as const,
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}