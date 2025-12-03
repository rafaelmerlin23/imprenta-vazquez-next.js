import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrintJobRequest, requestStatusOptions } from "@/lib/types";

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  request: PrintJobRequest | null;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  rejectionReason: string;
  onRejectionReasonChange: (reason: string) => void;
  availableTransitions: string[];
  isProcessing: boolean;
}

export function ChangeStatusModal({
  isOpen,
  onClose,
  onConfirm,
  request,
  selectedStatus,
  onStatusChange,
  rejectionReason,
  onRejectionReasonChange,
  availableTransitions,
  isProcessing,
}: StatusChangeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar estado de solicitud</DialogTitle>
          <DialogDescription>
            Estado actual:{" "}
            <strong>
              {request && requestStatusOptions[request.status]}
            </strong>
            <br />
            Selecciona el nuevo estado para esta solicitud.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="new-status">Nuevo estado *</Label>
            <Select
              value={selectedStatus}
              onValueChange={onStatusChange}
              disabled={isProcessing}
            >
              <SelectTrigger id="new-status">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                {availableTransitions.map((statusKey) => (
                  <SelectItem key={statusKey} value={statusKey}>
                    {requestStatusOptions[statusKey]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStatus === "5" && (
            <div className="grid gap-2">
              <Label htmlFor="rejection-reason">Razón del rechazo *</Label>
              <Input
                id="rejection-reason"
                placeholder="Explica por qué se rechaza esta solicitud (mínimo 10 caracteres)"
                value={rejectionReason}
                onChange={(e) => onRejectionReasonChange(e.target.value)}
                disabled={isProcessing}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {rejectionReason.length}/1000 caracteres
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            disabled={isProcessing || !selectedStatus}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? "Procesando..." : "Cambiar estado"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}