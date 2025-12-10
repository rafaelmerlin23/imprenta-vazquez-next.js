"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { FileText } from "lucide-react";
import { ErrorBadge } from "@/components/error-badge";
import axios from "@/lib/axios";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { TypeReceipt } from "@/lib/types";
import { useAppStore } from "@/app/stores/useAppStore";

const categories = ["Impresión", "Varios"];

const TypeReceiptCreate = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const { logout, token, currentLoginInfoUser } = useAppStore();

	const [formData, setFormData] = useState<Partial<TypeReceipt>>({
		name: "",
		description: "",
		receipt_category: "",
	});
	const [errors, setErrors] = useState<string[]>([]);

	useEffect(() => {
		if (currentLoginInfoUser != null && token != null) {
			setIsLoading(false);
		}
	}, [currentLoginInfoUser, token]);

	const handleSubmit = async () => {
		const newErrors: string[] = [];
		if (!formData.name)
			newErrors.push("El campo 'Nombre' es obligatorio.");
		if (!formData.receipt_category)
			newErrors.push("El campo 'Categoría' es obligatorio.");

		setErrors(newErrors);

		if (newErrors.length > 0) return;

		try {
			const response = await axios.post(
				"/api/type-receipts",
				{
					name: formData.name,
					description: formData.description,
					receipt_category: formData.receipt_category,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.status === 201) {
				router.push("/admin/dashboard");
			}
		} catch (error: any) {
			console.error("Error al crear el tipo de recibo:", error);
			if (error.response?.data?.errors) {
				const serverErrors = Object.values(
					error.response.data.errors
				).flat() as string[];
				setErrors(serverErrors);
			} else if (error.response?.data?.message) {
				setErrors([error.response.data.message]);
			} else {
				setErrors([
					"Error al crear el tipo de recibo. Por favor, intente de nuevo.",
				]);
			}
		}
	};

	const handleCancel = () => {
		setFormData({
			name: "",
			description: "",
			receipt_category: "",
		});
		setErrors([]);
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b bg-card">
				<div className="container mx-auto flex items-center justify-between px-4 py-4">
					<div className="flex items-center gap-3">
						<div className="rounded-lg bg-primary p-2">
							<FileText className="h-6 w-6 text-primary-foreground" />
						</div>
						<div>
							<h1 className="text-xl font-bold">Crear tipo de recibo</h1>
							<p className="text-sm text-muted-foreground">
								{currentLoginInfoUser?.username || "Usuario"}
							</p>
						</div>
					</div>
					<Button variant="outline" onClick={logout}>
						Cerrar Sesión
					</Button>
				</div>
			</header>

			<main className="container mx-auto max-w-5xl px-4 py-8">
				{errors.length > 0 && (
					<div className="mb-6">
						<ErrorBadge messages={errors} />
					</div>
				)}
				<Card>
					<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
						<div>
							<CardTitle className="text-2xl">
								Formulario de creación de tipo de recibo
							</CardTitle>
							<CardDescription className="mt-2">
								Registra un nuevo tipo de recibo
							</CardDescription>
						</div>
						<Button variant="destructive" onClick={handleCancel}>
							Cancelar
						</Button>
					</CardHeader>
					<CardContent>
						<div className="mb-6 rounded-lg bg-blue-50 p-4">
							<p className="text-sm">
								<span className="font-semibold">Campos requeridos</span>{" "}
								<span className="text-red-500">*</span>
							</p>
							<p className="text-sm text-muted-foreground">
								Los campos con el asterisco en rojo son obligatorios, así que
								deberá proporcionarlos para que el formulario se envíe
								correctamente.
							</p>
						</div>

						<div className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="name">
									Nombre <span className="text-red-500">*</span>
								</Label>
								<Input
									id="name"
									placeholder="Nota de venta"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="category">
									Categoría <span className="text-red-500">*</span>
								</Label>
								<Select
									value={formData.receipt_category}
									onValueChange={(value) =>
										setFormData({ ...formData, receipt_category: value })
									}
									required
								>
									<SelectTrigger className="w-full" id="category">
										<SelectValue placeholder="Seleccione una categoría" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((category) => (
											<SelectItem key={category} value={category}>
												{category}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Descripción</Label>
								<Textarea
									id="description"
									placeholder="Descripción del tipo de recibo"
									rows={4}
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
								/>
							</div>

							<div className="flex justify-end gap-4 pt-4">
								<Button variant="outline" onClick={handleCancel}>
									Cancelar
								</Button>
								<Button onClick={handleSubmit}>Crear tipo de recibo</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	);
};

export default TypeReceiptCreate;