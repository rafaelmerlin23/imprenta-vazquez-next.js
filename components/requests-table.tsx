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
import { Eye, Pen, Trash, ArrowRightCircle, ArrowRightToLineIcon } from "lucide-react";
import Link from "next/link";
import { PrintJobRequest, RequestStatus, User } from "@/lib/types";
import { useState } from "react";
import axios from "@/lib/axios";
import { ErrorDialog } from "./error-dialog";
import { DeleteRequestModal } from "./print-jobs/delete-request-modal";
import { ChangeStatusModal } from "./print-jobs/change-status-modal";

interface RequestsTableProps {
	requests: PrintJobRequest[];
	isAdmin: boolean;
	user: User;
}

const validStatusTransitions: Record<string, string[]> = {
	1: ["3", "5"],
	2: ["3", "4", "5"],
	3: ["4"],
	4: [],
	5: [],
};

const validStatusEditable: string[] = ["1", "2", "5"];

export function RequestsTable({ requests, user }: RequestsTableProps) {
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showStatusModal, setShowStatusModal] = useState(false);
	const [errorDialogOpen, setErrorDialogOpen] = useState(false);
	const [errorDialogTexts, setErrorDialogTexts] = useState({
		title: "",
		description: "",
	});
	const [selectedRequest, setSelectedRequest] = useState<PrintJobRequest | null>(null);
	const [selectedStatus, setSelectedStatus] = useState<string>("");
	const [rejectionReason, setRejectionReason] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

	const handleDeleteClick = (request: PrintJobRequest) => {
		setSelectedRequest(request);
		setShowDeleteModal(true);
	};

	const handleStatusChangeClick = (request: PrintJobRequest) => {
		setSelectedRequest(request);
		setSelectedStatus("");
		setRejectionReason("");
		setShowStatusModal(true);
	};

	const handleConfirmDelete = async () => {
		if (!selectedRequest) return;

		setIsDeleting(true);
		try {
			const response = await axios.delete(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}api/print-jobs/${selectedRequest.id}`
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

		if (selectedStatus === "5") {
			if (!rejectionReason.trim()) {
				setErrorDialogOpen(true);
				setErrorDialogTexts({
					title: "Campo requerido",
					description:
						"Debes proporcionar una razón para rechazar la solicitud.",
				});
				return;
			}

			if (rejectionReason.trim().length < 10) {
				setErrorDialogOpen(true);
				setErrorDialogTexts({
					title: "Razón muy corta",
					description: "La razón de rechazo debe tener al menos 10 caracteres.",
				});
				return;
			}

			if (rejectionReason.trim().length > 1000) {
				setErrorDialogOpen(true);
				setErrorDialogTexts({
					title: "Razón muy larga",
					description:
						"La razón de rechazo no debe exceder los 1000 caracteres.",
				});
				return;
			}
		}

		setIsProcessing(true);
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}api/print-jobs/${selectedRequest.id}/change-status`,
				{
					reason_rejection: selectedStatus === "5" ? rejectionReason.trim() : null,
					status: selectedStatus,
				}
			);

			if (response.status !== 200) {
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
	};

	const getAvailableTransitions = (currentStatus: string): string[] => {
		return validStatusTransitions[currentStatus] || [];
	};

	const canChangeStatus = (request: PrintJobRequest): boolean => {
		const transitions = getAvailableTransitions(request.status);
		return transitions.length > 0;
	};

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							{user.is_admin && <TableHead>Cliente</TableHead>}
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
									colSpan={user.is_admin ? 6 : 5}
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
									{user.is_admin && (
										<TableCell className="font-medium">
											{request.customer?.business_name}
										</TableCell>
									)}
									<TableCell className="max-w-md truncate">
										{request.name}
									</TableCell>
									<TableCell>
										<StatusBadge
											status={request.status as keyof RequestStatus}
										/>
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
										{!user.is_admin && validStatusEditable.includes(String(request.status)) && (
											<Link href={`/print-jobs/${request.id}/edit`}>
												<Button variant="edit" size="sm">
													<Pen className="h-4 w-4" />
												</Button>
											</Link>
										)}
										{user.is_admin && canChangeStatus(request) && (
											<Button
												onClick={() => handleStatusChangeClick(request)}
												variant="edit"
												size="sm"
											>
												<ArrowRightToLineIcon className="h-4 w-4" />
											</Button>
										)}
										{user.is_admin && (
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
				availableTransitions={
					selectedRequest ? getAvailableTransitions(selectedRequest.status) : []
				}
				isProcessing={isProcessing}
			/>
		</>
	);
}