import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TypeReceipt } from "@/lib/types";

interface DeleteTypeReceiptModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	typeReceipt: TypeReceipt | null;
	isDeleting: boolean;
}

export function DeleteTypeReceiptModal({
	isOpen,
	onClose,
	onConfirm,
	typeReceipt,
	isDeleting,
}: DeleteTypeReceiptModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>¿Eliminar tipo de recibo?</DialogTitle>
					<DialogDescription>
						Esta acción no se puede deshacer. El tipo de recibo "
						<span className="font-semibold">{typeReceipt?.name}</span>" será
						eliminado permanentemente del sistema.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isDeleting}>
						Cancelar
					</Button>
					<Button
						variant="destructive"
						onClick={onConfirm}
						disabled={isDeleting}
					>
						{isDeleting ? "Eliminando..." : "Eliminar"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
