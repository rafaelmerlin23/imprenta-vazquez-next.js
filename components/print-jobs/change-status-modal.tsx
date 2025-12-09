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
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	PrintJobRequest,
	requestStatusLabels,
	paymentMethodLabels,
	PaymentMethod,
} from "@/lib/types";
import { useAppStore } from "@/app/stores/useAppStore";
import { formatDate } from "@/lib/helpers";

interface StatusChangeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	request: PrintJobRequest | null;
	selectedStatus: string;
	onStatusChange: (status: string) => void;
	rejectionReason: string;
	onRejectionReasonChange: (reason: string) => void;
	estimatedDate: string;
	onEstimatedDateChange: (date: string) => void;
	price: string;
	onPriceChange: (price: string) => void;
	paymentMethod: string;
	onPaymentMethodChange: (method: string) => void;
	paymentAmount: string;
	onPaymentAmountChange: (amount: string) => void;
	paymentFile: File | null;
	onPaymentFileChange: (file: File | null) => void;
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
	estimatedDate,
	onEstimatedDateChange,
	price,
	onPriceChange,
	paymentMethod,
	onPaymentMethodChange,
	paymentAmount,
	onPaymentAmountChange,
	paymentFile,
	onPaymentFileChange,
	availableTransitions,
	isProcessing,
}: StatusChangeModalProps) {
	// Obtener la fecha mínima (hoy)
	const today = new Date().toISOString().split("T")[0];
	const { currentLoginInfoUser: user } = useAppStore();

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Cambiar estado de solicitud</DialogTitle>
					<DialogDescription className="flex flex-col justify-start text-left">
						<span>
							Estado actual:{" "}
							<strong>
								{request &&
									requestStatusLabels[
										request.status as keyof typeof requestStatusLabels
									]}
							</strong>
						</span>
						<br />
						Selecciona el nuevo estado para esta solicitud.
						{request?.status === "waiting_acceptance" && !user?.is_admin && (
							<>
								<span className="text-sm">
									{request?.price && (
										<>
											Monto a pagar: <strong>${request.price}</strong>
										</>
									)}
								</span>
								<span className="text-sm">
									{request?.estimated_date && (
										<>
											Fecha estimada de entrega:{" "}
											<strong>{formatDate(request.estimated_date)}</strong>
										</>
									)}
								</span>
							</>
						)}
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
					<div className="grid gap-2">
						<Label htmlFor="new-status">
							Nuevo estado <span className="text-red-500">*</span>
						</Label>
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
										{
											requestStatusLabels[
												statusKey as keyof typeof requestStatusLabels
											]
										}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					{/* Campos para WAITING_ACCEPTANCE (cuando admin envía cotización) */}
					{selectedStatus === "waiting_acceptance" && user?.is_admin && (
						<>
							<div className="grid gap-2">
								<Label htmlFor="price">
									Precio <span className="text-red-500">*</span>
								</Label>
								<div className="relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
										$
									</span>
									<Input
										id="price"
										type="number"
										step="0.01"
										min="0"
										placeholder="0.00"
										value={price}
										onChange={(e) => onPriceChange(e.target.value)}
										disabled={isProcessing}
										className="pl-7"
									/>
								</div>
								<p className="text-xs text-muted-foreground">
									Ingresa el precio total de la solicitud
								</p>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="estimated-date">
									Fecha estimada de entrega{" "}
									<span className="text-red-500">*</span>
								</Label>
								<Input
									id="estimated-date"
									type="date"
									min={today}
									value={estimatedDate}
									onChange={(e) => onEstimatedDateChange(e.target.value)}
									disabled={isProcessing}
								/>
								<p className="text-xs text-muted-foreground">
									La fecha debe ser igual o posterior a hoy
								</p>
							</div>
						</>
					)}
					{/* Campos para ACCEPTED (cuando cliente acepta y registra pago) */}
					{selectedStatus === "accepted" && !user?.is_admin && (
						<>
							<div className="grid gap-2">
								<Label htmlFor="payment-method">
									Método de pago <span className="text-red-500">*</span>
								</Label>
								<Select
									value={paymentMethod}
									onValueChange={onPaymentMethodChange}
									disabled={isProcessing}
								>
									<SelectTrigger id="payment-method">
										<SelectValue placeholder="Selecciona un método de pago" />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(paymentMethodLabels).map(([key, value]) => (
											<SelectItem key={key} value={key}>
												{value}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<p className="text-xs text-muted-foreground">
									Selecciona cómo realizarás el pago
								</p>
							</div>

							{/* Mostrar estos campos solo si NO es pago en efectivo (método 3) */}
							{(paymentMethod === "1" || paymentMethod === "2") && (
								<>
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
												placeholder="0.00"
												value={paymentAmount}
												onChange={(e) => onPaymentAmountChange(e.target.value)}
												disabled={isProcessing}
												className="pl-7"
											/>
										</div>
										<p className="text-xs text-muted-foreground">
											Precio total: ${request?.price || "0.00"}
										</p>
									</div>

									<div className="grid gap-2">
										<Label htmlFor="payment-file">
											Comprobante de pago{" "}
											<span className="text-red-500">*</span>
										</Label>
										<Input
											id="payment-file"
											type="file"
											accept="image/*,.pdf"
											onChange={(e) =>
												onPaymentFileChange(e.target.files?.[0] || null)
											}
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
								</>
							)}

							{/* Mensaje para pago en efectivo */}
							{paymentMethod === "3" && (
								<div className="bg-blue-50 border border-blue-200 rounded-md p-3">
									<p className="text-sm text-blue-800">
										<strong>Pago en efectivo seleccionado:</strong>
										<br />
										Deberás pagar en efectivo el día de la entrega en sucursal.
										<br />
										El monto a pagar es:{" "}
										<strong>${request?.price || "0.00"}</strong>
									</p>
								</div>
							)}
						</>
					)}

					{/* Campo para DECLINED (cuando admin deniega solicitud) */}
					{selectedStatus === "declined" && user?.is_admin && (
						<div className="grid gap-2">
							<Label htmlFor="rejection-reason">
								Razón de la denegación <span className="text-red-500">*</span>
							</Label>
							<Textarea
								id="rejection-reason"
								placeholder="Explica por qué se deniega esta solicitud (mínimo 10 caracteres)"
								value={rejectionReason}
								onChange={(e) => onRejectionReasonChange(e.target.value)}
								disabled={isProcessing}
								maxLength={1000}
								rows={4}
								className="resize-none"
							/>
							<p className="text-xs text-muted-foreground">
								{rejectionReason.length}/1000 caracteres
							</p>
						</div>
					)}
					{/* Campo para REJECTED (cuando cliente rechaza cotización) */}
					{selectedStatus === "rejected" && !user?.is_admin && (
						<div className="grid gap-2">
							<Label htmlFor="rejection-reason">
								Razón del rechazo <span className="text-red-500">*</span>
							</Label>
							<Textarea
								id="rejection-reason"
								placeholder="Explica por qué rechazas esta cotización (mínimo 10 caracteres)"
								value={rejectionReason}
								onChange={(e) => onRejectionReasonChange(e.target.value)}
								disabled={isProcessing}
								maxLength={1000}
								rows={4}
								className="resize-none"
							/>
							<p className="text-xs text-muted-foreground">
								{rejectionReason.length}/1000 caracteres
							</p>
						</div>
					)}
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isProcessing}>
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
