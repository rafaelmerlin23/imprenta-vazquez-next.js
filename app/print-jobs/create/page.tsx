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
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Upload, X } from "lucide-react";
import { ErrorBadge } from "@/components/error-badge";
import axios from "@/lib/axios";
import { User } from "@/lib/mock-data";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { PrintJobRequest as PrintRequest, paperSizeOptions, paperTypeOptions, typeReceiptOptions, copiesColors, tintColors } from "@/lib/types";
import { useAppStore } from "@/app/stores/useAppStore";

const PrintRequestForm = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const {logout,token,currentLoginInfoUser} = useAppStore()

	const [formData, setFormData] = useState<PrintRequest>({
		id: "",
		customer_id: "",
		name: "",
		folio: "",
		type_receipt_id: "",
		paper_size: "0",
		paper_type: "0",
		quantity: 0,
		copies_number: "",
		copies_colors: [],
		tint_colors: [],
		file_path: new File([], ""),
		description: "",
		status: "1",
		created_at: "",
		updated_at: "",
	});
	const [colorErrors, setColorErrors] = useState<{
		copies_colors?: string;
		tint_colors?: string;
	}>({});
	const [errors, setErrors] = useState<string[]>([]);

	useEffect(() => {
		if(currentLoginInfoUser != null && token != null){
			setIsLoading(false);
		}
		
	}, [currentLoginInfoUser,token]);

	const handleCheckboxChange = (
		field: "copies_colors" | "tint_colors",
		value: number
	) => {
		setFormData((prev) => {
			const currentValues = prev[field] || [];

			let newValues = currentValues.includes(value)
				? currentValues.filter((v) => v !== value)
				: [...currentValues, value];

			if (field === "copies_colors") {
				const copiesNumber = parseInt(prev.copies_number || "0");

				if (newValues.length > copiesNumber) {
					setColorErrors((e) => ({
						...e,
						copies_colors: `Debes seleccionar exactamente ${copiesNumber} color(es) de copia.`,
					}));
					return prev;
				} else {
					setColorErrors((e) => ({ ...e, copies_colors: undefined }));
				}
			}

			if (field === "tint_colors") {
				if (newValues.length > 4) {
					setColorErrors((e) => ({
						...e,
						tint_colors: "Solo puedes seleccionar hasta 4 colores de tinta.",
					}));
					return prev;
				} else {
					setColorErrors((e) => ({ ...e, tint_colors: undefined }));
				}
			}

			return { ...prev, [field]: newValues };
		});
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData((prev) => ({ ...prev, file_path: file }));
		}
	};

	const handleSubmit = async () => {
		console.log("Submitting form data:", formData);
		const newErrors: string[] = [];
		if (!formData.name)
			newErrors.push("El campo 'Nombre de la solicitud' es obligatorio.");
		if (!formData.type_receipt_id)
			newErrors.push("El campo 'Tipo' es obligatorio.");
		if (formData.quantity <= 0)
			newErrors.push("El campo 'Cantidad' debe ser mayor a cero.");
		if (!formData.paper_size)
			newErrors.push("El campo 'Tamaño de papel' es obligatorio.");
		if (!formData.paper_type)
			newErrors.push("El campo 'Tipo de papel' es obligatorio.");
		if (!formData.file_path)
			newErrors.push("El campo 'Documento de impresión' es obligatorio.");
		if (!formData.description)
			newErrors.push("El campo 'Descripción' es obligatorio.");
		if (formData.type_receipt_id === "1") {
			if (!formData.copies_number || parseInt(formData.copies_number) <= 0) {
				newErrors.push(
					"El campo 'Número de copias' es obligatorio y debe ser mayor a cero."
				);
			}
			const copiesNumber = parseInt(formData.copies_number || "0");
			if (formData.copies_colors?.length !== copiesNumber) {
				newErrors.push(
					`Debes seleccionar exactamente ${copiesNumber} color${
						copiesNumber > 1 ? "es" : ""
					} de copia.`
				);
			}
			if (formData.folio === "") {
				newErrors.push(
					"El campo 'Folio' es obligatorio para solicitudes de impresión."
				);
			}
		}
		if (formData.tint_colors?.length === 0) {
			newErrors.push("Debes seleccionar al menos un color de tinta.");
		}
		setErrors(newErrors);

		if (newErrors.length > 0) return;
		console.log("info del cliente",currentLoginInfoUser)
		if (!currentLoginInfoUser?.customer) {
			return newErrors.push("No se pudo obtener la información del cliente.");
		}
    const form = new FormData();

	form.append("customer_id", currentLoginInfoUser.customer.id);
    form.append("name", formData.name);
    form.append("type_receipt_id", formData.type_receipt_id);
    form.append("paper_size", formData.paper_size);
    form.append("paper_type", formData.paper_type);
    form.append("quantity", String(formData.quantity));
    form.append("description", formData.description);
    form.append("file_path", formData.file_path);

    if (formData.type_receipt_id === "1") {
        form.append("folio", formData.folio ?? "");
        form.append("copies_number", formData.copies_number ?? "");

        formData.copies_colors?.forEach((c) => {
            form.append("copies_colors[]", String(c));
        });
    }

    formData.tint_colors.forEach((t) => {
        form.append("tint_colors[]", String(t));
    });

    try {
        const response = await axios.post(
            "/api/print-jobs",
            form,
            {
                 headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (response.status === 201) {
            router.push("/client/dashboard");
        }
    } catch (error: any) {
        console.error("Error al enviar la solicitud:", error);
        console.log(error.response?.data);
    }
};

	const handleCancel = () => {
		setFormData({
			id: "",
			customer_id: "",
			name: "",
			folio: "",
			type_receipt_id: "",
			paper_size: "0",
			paper_type: "0",
			quantity: 0,
			copies_number: "",
			copies_colors: [],
			tint_colors: [],
			file_path: new File([], ""),
			description: "",
			status: "1",
			created_at: "",
			updated_at: "",
		});
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
							<h1 className="text-xl font-bold">Crear solicitud</h1>
							<p className="text-sm text-muted-foreground">Juan Pérez</p>
						</div>
					</div>
					<Button variant="outline">Cerrar Sesión</Button>
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
								Formulario de creación de solicitud de trabajos de impresión
							</CardTitle>
							<CardDescription className="mt-2">
								Registra tu solicitud
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
								deberá de proporcionarlos para que en formulario se envíe
								correctamente.
							</p>
						</div>

						<div className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="name">
									Nombre de la solicitud <span className="text-red-500">*</span>
								</Label>
								<Input
									id="name"
									placeholder="Solicitud de impresión para Juan Pérez"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									required
								/>
							</div>

							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="category">
										Tipo <span className="text-red-500">*</span>
									</Label>
									<Select
										value={formData.type_receipt_id}
										onValueChange={(value) =>
											setFormData({ ...formData, type_receipt_id: value })
										}
										required
									>
										<SelectTrigger className="w-full" id="category">
											<SelectValue placeholder="Seleccione una opción" />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(typeReceiptOptions).map(([key, value]) => (
												<SelectItem key={key} value={key}>
													{value}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="quantity">
										Cantidad <span className="text-red-500">*</span>
									</Label>
									<Input
										id="quantity"
										type="number"
										placeholder="Ingrese la cantidad"
										value={formData.quantity}
										onChange={(e) =>
											setFormData({
												...formData,
												quantity: parseInt(e.target.value),
											})
										}
										required
									/>
								</div>
							</div>

							{formData.type_receipt_id === "1" && (
								<>
									<div className="grid gap-6 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="copies_number">
												Número de copias <span className="text-red-500">*</span>
											</Label>
											<Input
												id="copies_number"
												type="number"
												min="1"
												placeholder="0"
												value={formData.copies_number}
												onChange={(e) =>
													setFormData({
														...formData,
														copies_number: e.target.value,
													})
												}
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="folio">
												Folio <span className="text-red-500">*</span>
											</Label>
											<Input
												id="folio"
												type="text"
												placeholder="1000 - 1500"
												value={formData.folio}
												onChange={(e) =>
													setFormData({ ...formData, folio: e.target.value })
												}
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label>
											Color de copias{" "}
											<span className="text-gray-600">
												(debe coincidir con el número de copias)
											</span>{" "}
											<span className="text-red-500">*</span>
										</Label>
										<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
											{Object.entries(copiesColors).map(([key, value]) => (
												<div key={key} className="flex items-center space-x-2">
													<Checkbox
														id={`copy-color-${key}`}
														checked={formData.copies_colors?.includes(
															parseInt(key)
														)}
														onCheckedChange={() =>
															handleCheckboxChange(
																"copies_colors",
																parseInt(key)
															)
														}
													/>
													<Label
														htmlFor={`copy-color-${key}`}
														className="cursor-pointer font-normal"
													>
														{value}
													</Label>
												</div>
											))}
										</div>
									</div>
								</>
							)}

							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="paper_size">
										Tamaño de papel <span className="text-red-500">*</span>
									</Label>
									<Select
										value={formData.paper_size}
										onValueChange={(value) =>
											setFormData({ ...formData, paper_size: value as PrintRequest['paper_size'] })
										}
										required
									>
										<SelectTrigger className="w-full" id="paper_size">
											<SelectValue placeholder="Seleccione una opción" />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(paperSizeOptions).map(([key, value]) => (
												<SelectItem key={key} value={key}>
													{value}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="paper_type">
										Tipo de papel <span className="text-red-500">*</span>
									</Label>
									<Select
										value={formData.paper_type}
										onValueChange={(value) =>
											setFormData({ ...formData, paper_type: value as PrintRequest['paper_type'] })
										}
										required
									>
										<SelectTrigger className="w-full" id="paper_type">
											<SelectValue placeholder="Seleccione una opción" />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(paperTypeOptions).map(([key, value]) => (
												<SelectItem key={key} value={key}>
													{value}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="file_path">
									Documento de impresión <span className="text-red-500">*</span>
								</Label>
								<div className="flex items-center gap-4">
									<Input
										id="file_path"
										type="file"
										onChange={handleFileChange}
										className="hidden"
										required
									/>
									<Label
										htmlFor="file_path"
										className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent"
									>
										<Upload className="h-4 w-4" />
										Selecciona un archivo
									</Label>
									{formData.file_path && (
										<span className="text-sm text-muted-foreground">
											{formData.file_path.name}
										</span>
									)}
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">
									Descripción <span className="text-red-500">*</span>
								</Label>
								<Textarea
									id="description"
									placeholder="Descripción específica del pedido"
									rows={4}
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label>
									Color de tintas{" "}
									<span className="text-gray-600">(máximo 4)</span>{" "}
									<span className="text-red-500">*</span>
								</Label>
								<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
									{Object.entries(tintColors).map(([key, value]) => (
										<div key={key} className="flex items-center space-x-2">
											<Checkbox
												id={`tint-color-${key}`}
												checked={formData.tint_colors.includes(parseInt(key))}
												onCheckedChange={() =>
													handleCheckboxChange("tint_colors", parseInt(key))
												}
											/>
											<Label
												htmlFor={`tint-color-${key}`}
												className="cursor-pointer font-normal"
											>
												{value}
											</Label>
										</div>
									))}
								</div>
							</div>

							<div className="flex justify-end gap-4 pt-4">
								<Button variant="outline" onClick={handleCancel}>
									Cancelar
								</Button>
								<Button onClick={handleSubmit}>Enviar Solicitud</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	);
};

export default PrintRequestForm;
