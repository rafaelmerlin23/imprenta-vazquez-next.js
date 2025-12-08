"use client";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { Eye, Pen, Trash, ArrowRightToLineIcon } from "lucide-react";
import Link from "next/link";
import { PrintJobRequest, RequestStatus, User } from "@/lib/types";
import { useState } from "react";
import axios from "@/lib/axios";
import { ErrorDialog } from "./error-dialog";
import { DeleteRequestModal } from "./print-jobs/delete-request-modal";
import { ChangeStatusModal } from "./print-jobs/change-status-modal";
import { useAppStore } from "@/app/stores/useAppStore";

interface RequestsTableProps {
	requests: PrintJobRequest[];
}

const validStatusTransitions: Record<string, string[]> = {
	pending: ["waiting_acceptance", "declined"],
	accepted: ["in_progress"],
	in_progress: ["completed"],
	declined: ["pending"],
	waiting_acceptance: [],
	completed: [],
	rejected: [],
};

// Transiciones permitidas para clientes
const clientStatusTransitions: Record<string, string[]> = {
	waiting_acceptance: ["accepted", "rejected"], // El cliente puede aceptar o rechazar la cotización
};

const validStatusEditable: string[] = [
	"waiting_acceptance",
	"pending",
	"declined",
];

export function RequestsTable({ requests }: RequestsTableProps) {
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showStatusModal, setShowStatusModal] = useState(false);
	const [errorDialogOpen, setErrorDialogOpen] = useState(false);
	const [errorDialogTexts, setErrorDialogTexts] = useState({
		title: "",
		description: "",
	});
	const [selectedRequest, setSelectedRequest] =
		useState<PrintJobRequest | null>(null);
	const [selectedStatus, setSelectedStatus] = useState<string>("");
	const [rejectionReason, setRejectionReason] = useState(""); // Cliente rechaza cotización
	const [estimatedDate, setEstimatedDate] = useState("");
	const [price, setPrice] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("");
	const [paymentAmount, setPaymentAmount] = useState("");
	const [paymentFile, setPaymentFile] = useState<File | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const { currentLoginInfoUser: user, token } = useAppStore();

	const handleDeleteClick = (request: PrintJobRequest) => {
		setSelectedRequest(request);
		setShowDeleteModal(true);
	};

	const handleStatusChangeClick = (request: PrintJobRequest) => {
		setSelectedRequest(request);
		setSelectedStatus("");
		setRejectionReason("");
		setPaymentMethod("");
		setPaymentAmount("");
		setPaymentFile(null);
		// Si la solicitud ya tiene precio y fecha, pre-llenar los campos
		setEstimatedDate(request.estimated_date || "");
		setPrice(request.price ? String(request.price) : "");
		setShowStatusModal(true);
	};

	const handleConfirmDelete = async () => {
		if (!selectedRequest) return;

		setIsDeleting(true);
		try {
			const response = await axios.delete(
				`api/print-jobs/${selectedRequest.id}`
			);

			if (response.status !== 200) {
				throw new Error("Error al eliminar la solicitud");
			}

			setShowDeleteModal(false);
			window.location.reload();
		} catch (error) {
			console.error("Error:", error);
			setShowDeleteModal(false);
			setErrorDialogOpen(true);
			setErrorDialogTexts({
				title: "Error al eliminar la solicitud",
				description:
					"Hubo un problema al eliminar la solicitud. Por favor, intenta de nuevo más tarde.",
			});
		} finally {
			setIsDeleting(false);
			setSelectedRequest(null);
		}
	};

	const handleConfirmStatusChange = async () => {
		if (!selectedRequest || !selectedStatus) {
			setErrorDialogOpen(true);
			setErrorDialogTexts({
				title: "Estado no seleccionado",
				description: "Por favor selecciona un estado válido.",
			});
			return;
		}

		// Validaciones para estado ACCEPTED
		if (selectedStatus === "accepted" && !user?.isAdmin) {
			if (!paymentMethod) {
				setErrorDialogOpen(true);
				setErrorDialogTexts({
					title: "Método de pago requerido",
					description: "Debes seleccionar un método de pago.",
				});
				return;
			}

			if ((paymentMethod === "1" || paymentMethod === "2") && !paymentFile) {
				setErrorDialogOpen(true);
				setErrorDialogTexts({
					title: "Comprobante requerido",
					description:
						"Debes adjuntar el comprobante de pago para este método.",
				});
				return;
			}

			if (paymentMethod === "3") {
				// Para pago en efectivo, usar el precio de la solicitud
				if (!selectedRequest.price || parseFloat(selectedRequest.price) <= 0) {
					setErrorDialogOpen(true);
					setErrorDialogTexts({
						title: "Precio requerido",
						description: "El precio de la solicitud no está definido.",
					});
					return;
				}
			}
		}

		// Validaciones para estado REJECTED
		if (selectedStatus === "rejected" || selectedStatus === "declined") {
			if (!rejectionReason.trim()) {
				setErrorDialogOpen(true);
				setErrorDialogTexts({
					title: "Campo requerido",
					description: "Debes proporcionar una razón.",
				});
				return;
			}

			if (rejectionReason.trim().length < 10) {
				setErrorDialogOpen(true);
				setErrorDialogTexts({
					title: "Razón muy corta",
					description: "La razón debe tener al menos 10 caracteres.",
				});
				return;
			}

			if (rejectionReason.trim().length > 1000) {
				setErrorDialogOpen(true);
				setErrorDialogTexts({
					title: "Razón muy larga",
					description: "La razón no debe exceder los 1000 caracteres.",
				});
				return;
			}
		}

		// Validaciones para WAITING_ACCEPTANCE (admin)
		if (selectedStatus === "waiting_acceptance" && user?.isAdmin) {
			if (!price || parseFloat(price) <= 0) {
				setErrorDialogOpen(true);
				setErrorDialogTexts({
					title: "Precio requerido",
					description: "Debes proporcionar un precio válido mayor a 0.",
				});
				return;
			}

			if (!estimatedDate) {
				setErrorDialogOpen(true);
				setErrorDialogTexts({
					title: "Fecha requerida",
					description: "Debes proporcionar una fecha estimada de entrega.",
				});
				return;
			}

			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const selectedDate = new Date(estimatedDate);

			if (selectedDate < today) {
				setErrorDialogOpen(true);
				setErrorDialogTexts({
					title: "Fecha inválida",
					description: "La fecha estimada debe ser igual o posterior a hoy.",
				});
				return;
			}
		}

		setIsProcessing(true);
		try {
			// Crear FormData para enviar archivos
			const formData = new FormData();
			formData.append("status", selectedStatus);

			// Agregar campos adicionales según el estado
			if (selectedStatus === "waiting_acceptance") {
				formData.append("price", price);
				formData.append("estimated_date", estimatedDate);
			} else if (
				selectedStatus === "rejected" ||
				selectedStatus === "declined"
			) {
				formData.append("reason_rejection", rejectionReason.trim());
			} else if (selectedStatus === "accepted" && !user?.isAdmin) {
				formData.append("payment_method", paymentMethod);

				if (paymentMethod === "1" || paymentMethod === "2") {
					// Para transferencias, usar el monto ingresado o el precio de la solicitud
					const amountToPay = parseFloat(paymentAmount) || selectedRequest.price;
					formData.append("payment_amount", amountToPay.toString());

					if (paymentFile) {
						formData.append("payment_file", paymentFile);
					}
				} else if (paymentMethod === "3") {
					// Para efectivo, usar el precio de la solicitud
					formData.append("payment_amount", selectedRequest.price || "0");
				}
			}

			console.log("Enviando FormData con archivo:", paymentFile?.name);

			const response = await axios.post(
				`api/print-jobs/${selectedRequest.id}/change-status`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${token}`, // Asegúrate de incluir el token
					},
				}
			);

			if (response.status !== 200) {
				setErrorDialogTexts({
					title: "Error al cambiar estado",
					description:
						"Hubo un problema al cambiar el estado de la solicitud. Por favor, intenta de nuevo más tarde.",
				});
				throw new Error("Error al cambiar el estado de la solicitud");
			}

			setShowStatusModal(false);
			window.location.reload();
		} catch (error: any) {
			console.error("Error:", error);
			setShowStatusModal(false);
			setErrorDialogOpen(true);

			const errorMessage =
				error.response?.data?.message ||
				error.response?.data?.errors?.payment_file?.join(", ") ||
				"Hubo un problema al cambiar el estado de la solicitud. Por favor, intenta de nuevo más tarde.";
			setErrorDialogTexts({
				title: "Error al cambiar estado",
				description: errorMessage,
			});
		} finally {
			setIsProcessing(false);
			setSelectedRequest(null);
			setSelectedStatus("");
			setRejectionReason("");
			setEstimatedDate("");
			setPrice("");
			setPaymentMethod("");
			setPaymentAmount("");
			setPaymentFile(null);
		}
	};

	const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
		setSelectedRequest(null);
	};

	const handleCloseStatusModal = () => {
		setShowStatusModal(false);
		setSelectedRequest(null);
		setSelectedStatus("");
		setRejectionReason("");
		setEstimatedDate("");
		setPrice("");
		setPaymentMethod("");
		setPaymentAmount("");
		setPaymentFile(null);
	};

	const getAvailableTransitions = (currentStatus: string): string[] => {
		// Si es cliente, usar las transiciones de cliente
		if (!user?.isAdmin) {
			return clientStatusTransitions[currentStatus] || [];
		}
		// Si es admin, usar todas las transiciones
		return validStatusTransitions[currentStatus] || [];
	};

	const canChangeStatus = (request: PrintJobRequest): boolean => {
		const transitions = getAvailableTransitions(request.status);
		return transitions.length > 0;
	};

	if (!requests || requests.length === 0) {
		return (
			<div className="text-center py-10 text-muted-foreground">
				No hay solicitudes
			</div>
		);
	}

	if (!user) {
		return (
			<div className="text-center py-10 text-muted-foreground">
				Error: Información del usuario no disponible.
			</div>
		);
	}

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							{user.isAdmin && <TableHead>Cliente</TableHead>}
							<TableHead>Nombre</TableHead>
							<TableHead>Estado</TableHead>
							<TableHead>Fecha</TableHead>
							<TableHead className="text-right">Acciones</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{requests.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={user.isAdmin ? 6 : 5}
									className="text-center text-muted-foreground"
								>
									No hay solicitudes
								</TableCell>
							</TableRow>
						) : (
							requests.map((request) => (
								<TableRow key={request.id}>
									<TableCell className="font-mono text-sm">
										#{request.id}
									</TableCell>
									{user.isAdmin && (
										<TableCell className="font-medium">
											{request.customer?.business_name}
										</TableCell>
									)}
									<TableCell className="max-w-md truncate">
										{request.name}
									</TableCell>
									<TableCell>
										<StatusBadge status={request.status} />
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{new Date(request.created_at).toLocaleDateString("es-MX")}
									</TableCell>
									<TableCell className="text-right">
										<Link href={`/print-jobs/${request.id}/show`}>
											<Button variant="show" size="sm">
												<Eye className="h-4 w-4" />
											</Button>
										</Link>
										{!user.isAdmin &&
											validStatusEditable.includes(request.status) && (
												<Link href={`/print-jobs/${request.id}/edit`}>
													<Button variant="edit" size="sm">
														<Pen className="h-4 w-4" />
													</Button>
												</Link>
											)}
										{((user.isAdmin && canChangeStatus(request)) ||
											(!user.isAdmin && request.status === "waiting_acceptance")) && (
											<Button
												onClick={() => handleStatusChangeClick(request)}
												variant="edit"
												size="sm"
											>
												<ArrowRightToLineIcon className="h-4 w-4" />
											</Button>
										)}
										{user.isAdmin && (
											<Button
												onClick={() => handleDeleteClick(request)}
												variant="danger"
												size="sm"
											>
												<Trash className="h-4 w-4" />
											</Button>
										)}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<ErrorDialog
				isOpen={errorDialogOpen}
				onClose={() => setErrorDialogOpen(false)}
				title={errorDialogTexts.title}
				description={errorDialogTexts.description}
			/>

			<DeleteRequestModal
				isOpen={showDeleteModal}
				onClose={handleCloseDeleteModal}
				onConfirm={handleConfirmDelete}
				request={selectedRequest}
				isDeleting={isDeleting}
			/>

			<ChangeStatusModal
				isOpen={showStatusModal}
				onClose={handleCloseStatusModal}
				onConfirm={handleConfirmStatusChange}
				request={selectedRequest}
				selectedStatus={selectedStatus}
				onStatusChange={setSelectedStatus}
				rejectionReason={rejectionReason}
				onRejectionReasonChange={setRejectionReason}
				estimatedDate={estimatedDate}
				onEstimatedDateChange={setEstimatedDate}
				price={price}
				onPriceChange={setPrice}
				paymentMethod={paymentMethod}
				onPaymentMethodChange={setPaymentMethod}
				paymentAmount={paymentAmount}
				onPaymentAmountChange={setPaymentAmount}
				paymentFile={paymentFile}
				onPaymentFileChange={setPaymentFile}
				availableTransitions={
					selectedRequest ? getAvailableTransitions(selectedRequest.status) : []
				}
				isProcessing={isProcessing}
			/>
		</>
	);
}
