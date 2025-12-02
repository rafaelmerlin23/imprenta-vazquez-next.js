"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { StatusBadge } from "./status-badge"
import { Calendar, DollarSign, CreditCard, Mail } from "lucide-react"
import type { PrintRequest } from "@/lib/mock-data"

interface RequestDetailsDialogProps {
  request: PrintRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isAdmin: boolean
}

export function RequestDetailsDialog({ request, open, onOpenChange, isAdmin }: RequestDetailsDialogProps) {
  const [estimatedTime, setEstimatedTime] = useState("")
  const [quotation, setQuotation] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"transferencia" | "efectivo">("transferencia")
  const [paymentType, setPaymentType] = useState<"total" | "anticipo">("total")
  const [advance, setAdvance] = useState("")

  if (!request) return null

  const canValidate = isAdmin && request.status === "1" // solicitada
  const canAccept = !isAdmin && request.status === "2" // esperando_aceptacion
  const canMarkComplete = isAdmin && request.status === "3" // en_proceso

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Solicitud #{request.id}
            <StatusBadge status={request.status} />
          </DialogTitle>
          <DialogDescription>
            {isAdmin ? `Cliente: ${request.clientName}` : "Detalles de tu solicitud"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea value={request.description} readOnly className="min-h-[100px]" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Fecha de Solicitud</Label>
              <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(request.created_at).toLocaleDateString("es-MX")}</span>
              </div>
            </div>

            {request.estimatedTime && (
              <div className="space-y-2">
                <Label>Tiempo Estimado</Label>
                <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{request.estimatedTime}</span>
                </div>
              </div>
            )}
          </div>

          {/* Validation Form (Admin only, status: solicitada) */}
          {canValidate && (
            <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
              <h3 className="font-semibold">Validar Solicitud</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="estimatedTime">Tiempo Estimado</Label>
                  <Input
                    id="estimatedTime"
                    placeholder="Ej: 48 horas"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quotation">Cotización (MXN)</Label>
                  <Input
                    id="quotation"
                    type="number"
                    placeholder="1500"
                    value={quotation}
                    onChange={(e) => setQuotation(e.target.value)}
                  />
                </div>
              </div>
              <Button className="w-full">Enviar Cotización al Cliente</Button>
            </div>
          )}

          {/* Quotation Display */}
          {request.quotation && (
            <div className="space-y-2">
              <Label>Cotización</Label>
              <div className="flex items-center gap-2 rounded-md border bg-accent/10 px-3 py-2 font-semibold">
                <DollarSign className="h-4 w-4 text-accent" />
                <span>${request.quotation.toLocaleString("es-MX")} MXN</span>
              </div>
            </div>
          )}

          {/* Accept Form (Client only, status: esperando_aceptacion) */}
          {canAccept && (
            <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
              <h3 className="font-semibold">Aceptar Solicitud</h3>

              <div className="space-y-3">
                <Label>Método de Pago</Label>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transferencia" id="transfer" />
                    <Label htmlFor="transfer" className="font-normal">
                      Transferencia Bancaria
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="efectivo" id="cash" />
                    <Label htmlFor="cash" className="font-normal">
                      Efectivo (en entrega)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === "transferencia" && (
                <div className="space-y-3">
                  <Label>Tipo de Pago</Label>
                  <RadioGroup value={paymentType} onValueChange={(v) => setPaymentType(v as any)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="total" id="full" />
                      <Label htmlFor="full" className="font-normal">
                        Pago Total
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="anticipo" id="advance" />
                      <Label htmlFor="advance" className="font-normal">
                        Dejar Anticipo
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentType === "anticipo" && (
                    <div className="space-y-2">
                      <Label htmlFor="advance">Monto del Anticipo (MXN)</Label>
                      <Input
                        id="advance"
                        type="number"
                        placeholder="500"
                        value={advance}
                        onChange={(e) => setAdvance(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="proof">Comprobante de Pago</Label>
                    <Input id="proof" type="file" accept="image/*,.pdf" />
                  </div>
                </div>
              )}

              <Button className="w-full">Confirmar y Aceptar Solicitud</Button>
            </div>
          )}

          {/* Payment Info Display */}
          {request.paymentMethod && (
            <div className="space-y-3 rounded-lg border p-4">
              <h3 className="font-semibold">Información de Pago</h3>
              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Método: <span className="font-medium capitalize">{request.paymentMethod}</span>
                  </span>
                </div>
                {request.paymentMethod === "transferencia" && (
                  <div className="text-sm">
                    Estado:{" "}
                    <span className="font-medium">
                      {request.isPaidInFull
                        ? "Pagado en su totalidad"
                        : `Anticipo de $${request.advance?.toLocaleString("es-MX")} MXN`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Complete Request (Admin only, status: en_proceso) */}
          {canMarkComplete && (
            <div className="space-y-4 rounded-lg border bg-success/10 p-4">
              <h3 className="font-semibold">Marcar como Terminada</h3>
              <p className="text-sm text-muted-foreground">
                Al marcar como terminada, se enviará una notificación por correo al cliente.
              </p>
              <Button className="w-full bg-success hover:bg-success/90 text-success-foreground">
                <Mail className="mr-2 h-4 w-4" />
                Marcar como Terminada y Notificar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
