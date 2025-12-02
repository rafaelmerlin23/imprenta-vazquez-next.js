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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import { Eye, Pen, Trash } from "lucide-react";
import Link from "next/link";
import type { PrintRequest } from "@/lib/mock-data";
import { useState } from "react";
import axios from "@/lib/axios";
import { ErrorDialog } from "./error-dialog";

interface RequestsTableProps {
    requests: PrintRequest[];
    isAdmin: boolean;
}

export function RequestsTable({ requests, isAdmin }: RequestsTableProps) {
    const [showModal, setShowModal] = useState(false);
	const [errorDialogOpen, setErrorDialogOpen] = useState(false);
	const [errorDialogTexts, setErrorDialogTexts] = useState({title: "", description: ""});
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (id: string) => {
        setSelectedId(id);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedId) return;

        setIsDeleting(true);
        try {
            const response = axios.delete(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}api/print-jobs/${selectedId}`
			);

            if ((await response).status !== 200) {
                throw new Error("Error al eliminar la solicitud");
            }

            // Cerrar modal y recargar página o actualizar estado
            setShowModal(false);
            window.location.reload(); // O mejor: actualizar el estado local
        } catch (error) {
            console.error("Error:", error);
            setShowModal(false);
			setErrorDialogOpen(true);
			setErrorDialogTexts({
				title: "Error al eliminar la solicitud",
				description: "Hubo un problema al eliminar la solicitud. Por favor, intenta de nuevo más tarde."
			});
        } finally {
            setIsDeleting(false);
            setSelectedId(null);
        }
    };

    const handleCancelDelete = () => {
        setShowModal(false);
        setSelectedId(null);
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            {isAdmin && <TableHead>Cliente</TableHead>}
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
                                    colSpan={isAdmin ? 6 : 5}
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
                                    {isAdmin && (
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
                                        <Link href={`/print-jobs/${request.id}/edit`}>
                                            <Button variant="edit" size="sm">
                                                <Pen className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={() => handleDeleteClick(request.id)}
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

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Eliminar solicitud?</DialogTitle>
                        <DialogDescription>
                            Esta acción no se puede deshacer. La solicitud será eliminada
                            permanentemente del sistema.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={handleCancelDelete}
                            disabled={isDeleting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Eliminando..." : "Eliminar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}