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
import { PrintJobRequest } from "@/lib/types";

interface AddPaymentModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	request: PrintJobRequest | null;
	paymentAmount: string;
	onPaymentAmountChange: (amount: string) => void;
	paymentFile: File | null;
	onPaymentFileChange: (file: File | null) => void;
	isProcessing: boolean;
	remainingAmount: number;
}

export function AddPaymentModal({
	isOpen,
	onClose,
	onConfirm,
	request,
	paymentAmount,
	onPaymentAmountChange,
	paymentFile,
	onPaymentFileChange,
	isProcessing,
	remainingAmount,
}: AddPaymentModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Agregar pago</DialogTitle>
					<DialogDescription>
						Solicitud: <strong>{request?.name}</strong>
						<br />
						Monto restante:{" "}
						<strong className="text-amber-700">
							${remainingAmount.toFixed(2)} MXN
						</strong>
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					{/* Mostrar campos solo si NO es pago en efectivo */}
					<div className="grid gap-2">
						<Label htmlFor="payment-amount">
							Monto a pagar <span className="text-red-500">*</span>
						</Label>
						<div className="relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
								$
							</span>
							<Input
								id="payment-amount"
								type="number"
								step="0.01"
								min="0"
								max={remainingAmount}
								placeholder="0.00"
								value={paymentAmount}
								onChange={(e) => onPaymentAmountChange(e.target.value)}
								disabled={isProcessing}
								className="pl-7"
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							Máximo: ${remainingAmount.toFixed(2)} MXN
						</p>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="payment-file">
							Comprobante de pago <span className="text-red-500">*</span>
						</Label>
						<Input
							id="payment-file"
							type="file"
							accept="image/*,.pdf"
							onChange={(e) => onPaymentFileChange(e.target.files?.[0] || null)}
							disabled={isProcessing}
						/>
						{paymentFile && (
							<p className="text-xs text-muted-foreground">
								Archivo: {paymentFile.name}
							</p>
						)}
						<p className="text-xs text-muted-foreground">
							Adjunta la captura o comprobante de tu transferencia
						</p>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isProcessing}>
						Cancelar
					</Button>
					<Button
						variant="default"
						onClick={onConfirm}
						disabled={isProcessing}
						className="bg-green-600 hover:bg-green-700"
					>
						{isProcessing ? "Procesando..." : "Registrar pago"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
