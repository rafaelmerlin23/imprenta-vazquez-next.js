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
import { Eye, Pen, Trash } from "lucide-react";
import Link from "next/link";
import { TypeReceipt } from "@/lib/types";
import { useState } from "react";
import axios from "@/lib/axios";
import { ErrorDialog } from "./error-dialog";
import { useAppStore } from "@/app/stores/useAppStore";
import { DeleteTypeReceiptModal } from "./delete-type-receipt-modal";

interface TypeReceiptsTableProps {
	typeReceipts: TypeReceipt[];
}

export default function TypeReceiptsTable({
	typeReceipts,
}: TypeReceiptsTableProps) {
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [errorDialogOpen, setErrorDialogOpen] = useState(false);
	const [errorDialogTexts, setErrorDialogTexts] = useState({
		title: "",
		description: "",
	});
	const [selectedTypeReceipt, setSelectedTypeReceipt] =
		useState<TypeReceipt | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const { token } = useAppStore();

	const handleDeleteClick = (typeReceipt: TypeReceipt) => {
		setSelectedTypeReceipt(typeReceipt);
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = async () => {
		if (!selectedTypeReceipt) return;

		setIsDeleting(true);
		try {
			const response = await axios.delete(
				`api/type-receipts/${selectedTypeReceipt.id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status !== 200) {
				throw new Error("Error al eliminar el tipo de recibo");
			}

			setShowDeleteModal(false);
			window.location.reload();
		} catch (error) {
			console.error("Error:", error);
			setShowDeleteModal(false);
			setErrorDialogOpen(true);
			setErrorDialogTexts({
				title: "Error al eliminar",
				description:
					"Hubo un problema al eliminar el tipo de recibo. Por favor, intenta de nuevo más tarde.",
			});
		} finally {
			setIsDeleting(false);
			setSelectedTypeReceipt(null);
		}
	};

	const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
		setSelectedTypeReceipt(null);
	};

	if (!typeReceipts || typeReceipts.length === 0) {
		return (
			<div className="text-center py-10 text-muted-foreground">
				No hay tipos de recibos
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
							<TableHead>Nombre</TableHead>
							<TableHead>Descripción</TableHead>
							<TableHead>Categoría de recibos</TableHead>
							<TableHead className="text-right">Acciones</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{typeReceipts.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="text-center text-muted-foreground"
								>
									No hay tipos de recibos
								</TableCell>
							</TableRow>
						) : (
							typeReceipts.map((typeReceipt) => (
								<TableRow key={typeReceipt.id}>
									<TableCell className="font-mono text-sm">
										#{typeReceipt.id}
									</TableCell>
									<TableCell className="font-medium">
										{typeReceipt.name}
									</TableCell>
									<TableCell className="max-w-md truncate">
										{typeReceipt.description}
									</TableCell>
									<TableCell>{typeReceipt.receipt_category}</TableCell>
									<TableCell className="text-right">
										<Link href={`/type-receipts/${typeReceipt.id}/show`}>
											<Button variant="show" size="sm">
												<Eye className="h-4 w-4" />
											</Button>
										</Link>
										<Link href={`/type-receipts/${typeReceipt.id}/edit`}>
											<Button variant="edit" size="sm">
												<Pen className="h-4 w-4" />
											</Button>
										</Link>
										<Button
											onClick={() => handleDeleteClick(typeReceipt)}
											variant="danger"
											size="sm"
										>
											<Trash className="h-4 w-4" />
										</Button>
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

			{showDeleteModal && (
				<DeleteTypeReceiptModal
					isOpen={showDeleteModal}
					onClose={handleCloseDeleteModal}
					onConfirm={handleConfirmDelete}
					typeReceipt={selectedTypeReceipt}
					isDeleting={isDeleting}
				/>
			)}
		</>
	);
}
