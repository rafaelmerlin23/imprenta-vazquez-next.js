"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Upload, X, Eye, File } from "lucide-react";
import axios from "@/lib/axios";
import LoadingSpinner from "@/components/ui/loading-spinner";
import Link from "next/link";
import { PrintJobRequest, User } from "@/lib/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	paperSizeOptions,
	paperTypeOptions,
	typeReceiptOptions,
	copiesColors,
	tintColors,
} from "@/lib/types";
import { useAppStore } from "@/app/stores/useAppStore";
import { ErrorBadge } from "@/components/error-badge";

const PrintJobRequestEdit = () => {
	const router = useRouter();
	const { id } = useParams();

	const [data, setData] = useState<PrintJobRequest | null>(null);
	const user: User | null = useAppStore((state) => state.currentLoginInfoUser);
	const token = useAppStore((state) => state.token);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [newFile, setNewFile] = useState<File | null>(null);
	const [showPreview, setShowPreview] = useState(false);
	const [errors, setErrors] = useState<string[]>([]);

	const normalizePrintRequest = (data: any): PrintJobRequest => {
		return {
			id: data.id ?? "",
			customer_id: String(data.customer_id ?? ""),
			name: data.name ?? "",
			folio: data.folio ?? "",
			type_receipt_id: String(data.type_receipt_id ?? ""),
			paper_size: String(data.paper_size ?? "1"),
			paper_type: String(data.paper_type ?? "1"),
			quantity: Number(data.quantity ?? 0),
			copies_number: data.copies_number ? String(data.copies_number) : "",
			copies_colors: Array.isArray(data.copies_colors)
				? data.copies_colors.map((c: string | number) => Number(c))
				: [],
			tint_colors: Array.isArray(data.tint_colors)
				? data.tint_colors.map((t: string | number) => Number(t))
				: [],
			file_path: data.file_path ?? null,
			description: data.description ?? "",
			status: data.status ?? "",
			estimated_date: data.estimated_date ?? undefined,
			price: data.price ? Number(data.price) : undefined,
			created_at: data.created_at ?? "",
			updated_at: data.updated_at ?? "",
		};
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`/api/print-jobs/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const normalized = normalizePrintRequest(response.data);
				setData(normalized);
			} catch (error) {
				console.error("Error al obtener la solicitud:", error);
				setErrors(["Error al cargar la solicitud."]);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [id, token]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setNewFile(file);
			setShowPreview(false);
		}
	};

	const handleRemoveNewFile = () => {
		setNewFile(null);
	};

	const getFileName = (filepath: string | File | null) => {
		if (typeof filepath === "string") {
			return filepath.split("/").pop() || "archivo";
		}
		if (filepath instanceof File) {
			return filepath.name || "archivo";
		}
		return "archivo";
	};

	const handleSubmit = async () => {
		if (!data) {
			alert("No hay datos para enviar.");
			return;
		}

		const newErrors: string[] = [];

		// Validaciones básicas
		if (!data.name) newErrors.push("El campo 'Nombre' es obligatorio.");
		if (!data.type_receipt_id) newErrors.push("El campo 'Tipo' es obligatorio.");
		if (data.quantity <= 0) newErrors.push("La cantidad debe ser mayor a 0.");
		if (!data.paper_size || data.paper_size === "0") 
			newErrors.push("El campo 'Tamaño de papel' es obligatorio.");
		if (!data.paper_type || data.paper_type === "0") 
			newErrors.push("El campo 'Tipo de papel' es obligatorio.");
		if (!data.description) 
			newErrors.push("El campo 'Descripción' es obligatorio.");

		// Validaciones condicionales para tipo_receipt_id === "1"
		if (data.type_receipt_id === "1") {
			if (!data.copies_number || parseInt(data.copies_number) <= 0) {
				newErrors.push("El campo 'Número de copias' es obligatorio.");
			}
			const copiesNumber = parseInt(data.copies_number || "0");
			if (data.copies_colors?.length !== copiesNumber) {
				newErrors.push(
					`Debes seleccionar exactamente ${copiesNumber} color${
						copiesNumber > 1 ? "es" : ""
					} de copia.`
				);
			}
			if (!data.folio) {
				newErrors.push("El campo 'Folio' es obligatorio.");
			}
		}

		// Validación de colores de tinta
		if (data.tint_colors.length === 0) {
			newErrors.push("Debes seleccionar al menos un color de tinta.");
		}

		if (newErrors.length > 0) {
			setErrors(newErrors);
			return;
		}

		const form = new FormData();

		form.append("_method", "PUT");

		if (!user?.customer) {
			alert("No se encontró el cliente asociado al usuario.");
			return;
		}

		form.append("customer_id", user.customer.id);
		form.append("name", data.name);
		form.append("type_receipt_id", data.type_receipt_id);
		form.append("paper_size", data.paper_size);
		form.append("paper_type", data.paper_type);
		form.append("quantity", String(data.quantity));
		form.append("description", data.description);

		if (newFile) {
			form.append("file_path", newFile);
		}

		if (data.type_receipt_id === "1") {
			if (data.folio) form.append("folio", data.folio);
			if (data.copies_number) form.append("copies_number", data.copies_number);

			data.copies_colors?.forEach((c) => {
				form.append("copies_colors[]", String(c));
			});
		}

		data.tint_colors.forEach((t) => {
			form.append("tint_colors[]", String(t));
		});

		try {
			const response = await axios.post(`/api/print-jobs/${id}`, form, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.status === 200) {
				router.push("/client/dashboard");
			}
		} catch (error: any) {
			console.error("Error al actualizar la solicitud:", error);
			if (error.response?.data?.errors) {
				const serverErrors = Object.values(error.response.data.errors).flat() as string[];
				setErrors(serverErrors);
			} else if (error.response?.data?.message) {
				setErrors([error.response.data.message]);
			} else {
				setErrors(["Error al actualizar la solicitud. Por favor, intente de nuevo."]);
			}
		}
	};

	if (isLoading) {
		return <LoadingSpinner variant="overlay" text="Cargando solicitud..." />;
	}

	if (!data) {
		return <div>No se encontró la solicitud.</div>;
	}

	const currentFile = newFile || data.file_path;

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b bg-card">
				<div className="container mx-auto flex items-center justify-between px-4 py-4">
					<div className="flex items-center gap-3">
						<div className="rounded-lg bg-primary p-2">
							<FileText className="h-6 w-6 text-primary-foreground" />
						</div>
						<div>
							<h1 className="text-xl font-bold">Detalle de solicitud</h1>
							<p className="text-sm text-muted-foreground">#{data.id}</p>
						</div>
					</div>

					<Button
						variant="outline"
						onClick={() => router.push("/client/dashboard")}
					>
						Volver
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
								Editar solicitud de impresión
							</CardTitle>
							<CardDescription className="mt-2">
								Información registrada
							</CardDescription>
						</div>
						<Link
							href={`/print-jobs/${id}/show`}
							className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
						>
							Cancelar
						</Link>
					</CardHeader>

					<CardContent>
						<div className="space-y-6">
							{/* NOMBRE */}
							<div className="space-y-2">
								<Label>Nombre de la solicitud <span className="text-red-500">*</span></Label>
								<Input
									value={data.name}
									onChange={(e) => setData({ ...data, name: e.target.value })}
								/>
							</div>

							{/* TIPO / CANTIDAD */}
							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Tipo <span className="text-red-500">*</span></Label>
									<Select
										value={data.type_receipt_id}
										onValueChange={(value) =>
											setData({ ...data, type_receipt_id: value })
										}
										required
									>
										<SelectTrigger className="w-full" id="category">
											<SelectValue placeholder="Seleccione una opción" />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(typeReceiptOptions).map(
												([key, value]) => (
													<SelectItem key={key} value={key}>
														{value}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label>Cantidad <span className="text-red-500">*</span></Label>
									<Input
										type="number"
										min="1"
										value={data.quantity}
										onChange={(e) =>
											setData({ ...data, quantity: Number(e.target.value) })
										}
									/>
								</div>
							</div>

							{/* CAMPOS SOLO SI ES TIPO 1 */}
							{data.type_receipt_id === "1" && (
								<>
									<div className="grid gap-6 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Número de copias <span className="text-red-500">*</span></Label>
											<Input
												type="number"
												min="1"
												value={data.copies_number}
												onChange={(e) =>
													setData({ ...data, copies_number: e.target.value })
												}
											/>
										</div>

										<div className="space-y-2">
											<Label>Folio <span className="text-red-500">*</span></Label>
											<Input
												value={data.folio}
												onChange={(e) =>
													setData({ ...data, folio: e.target.value })
												}
											/>
										</div>
									</div>

									{/* COLORES DE COPIA */}
									<div>
										<Label>
											Color de copias <span className="text-red-500">*</span>
											<span className="text-gray-600 ml-2">
												(debe coincidir con el número de copias)
											</span>
										</Label>
										<div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mt-2">
											{Object.entries(copiesColors).map(([key, value]) => (
												<div key={key} className="flex items-center space-x-2">
													<Checkbox
														checked={data.copies_colors?.includes(Number(key))}
														onCheckedChange={(checked) => {
															const colorId = Number(key);
															setData({
																...data,
																copies_colors: checked
																	? [...(data.copies_colors || []), colorId]
																	: data.copies_colors?.filter(
																			(c) => c !== colorId
																	  ) || [],
															});
														}}
													/>
													<span>{value}</span>
												</div>
											))}
										</div>
									</div>
								</>
							)}

							{/* TAMAÑO Y TIPO DE PAPEL */}
							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Tamaño de papel <span className="text-red-500">*</span></Label>
									<Select
										value={data.paper_size}
										onValueChange={(value) =>
											setData({ ...data, paper_size: value })
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
									<Label>Tipo de papel <span className="text-red-500">*</span></Label>
									<Select
										value={data.paper_type}
										onValueChange={(value) =>
											setData({ ...data, paper_type: value })
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

							{/* ARCHIVO CON VISTA PREVIA */}
							<div className="space-y-3">
								<Label>Documento de impresión</Label>

								{currentFile ? (
									<div className="space-y-3">
										{/* Card del archivo */}
										<div
											className={`p-4 border rounded-lg ${
												newFile ? "bg-green-50 border-green-500" : "bg-gray-50"
											}`}
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div
														className={`p-2 rounded ${
															newFile ? "bg-green-100" : "bg-blue-100"
														}`}
													>
														<File className="h-5 w-5 text-blue-600" />
													</div>
													<div>
														<p
															className={`text-sm font-medium ${
																newFile ? "text-green-700" : ""
															}`}
														>
															{newFile ? "Nuevo archivo" : "Archivo actual"}
														</p>
														<p className="text-xs text-gray-500 uppercase">
															{getFileName(currentFile)}
														</p>
													</div>
												</div>
												<div className="flex items-center gap-2">
													{newFile ? (
														<Button
															variant="ghost"
															size="sm"
															onClick={handleRemoveNewFile}
															className="text-red-600 hover:text-red-700 hover:bg-red-50"
														>
															<X className="h-4 w-4" />
														</Button>
													) : (
														<Button
															variant="ghost"
															size="sm"
															onClick={() => setShowPreview(!showPreview)}
															className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
														>
															<Eye className="h-4 w-4 mr-2" />
															{showPreview ? "Ocultar" : "Ver"}
														</Button>
													)}
												</div>
											</div>
										</div>

										{/* Vista previa */}
										{showPreview &&
											!newFile &&
											typeof currentFile === "string" && (
												<div className="border-2 border-blue-500 rounded-lg overflow-hidden bg-white">
													<div className="bg-blue-50 px-4 py-2 flex items-center justify-between border-b">
														<p className="text-sm font-medium text-blue-900">
															Vista previa del documento
														</p>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => setShowPreview(false)}
															className="text-blue-600 hover:text-blue-700"
														>
															<X className="h-4 w-4" />
														</Button>
													</div>

													<div className="p-4">
														<iframe
															src={currentFile}
															className="w-full rounded shadow-lg"
															style={{ height: "600px" }}
															title="Vista previa PDF"
														/>
													</div>
												</div>
											)}
									</div>
								) : (
									<div className="p-4 border rounded-lg bg-gray-50 text-center text-gray-500">
										<FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
										<p className="text-sm">No hay archivo adjunto</p>
									</div>
								)}

								{/* Botón para cargar nuevo archivo */}
								<div className="flex items-center gap-4">
									<Input
										id="file_path_edit"
										type="file"
										accept=".pdf"
										onChange={handleFileChange}
										className="sr-only peer"
									/>
									<Label
										htmlFor="file_path_edit"
										className="
											flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background
											px-4 py-2 text-sm
											hover:bg-accent
											peer-focus-visible:outline-none
											peer-focus-visible:ring-2
											peer-focus-visible:ring-ring
											peer-focus-visible:ring-offset-2
										"
									>
										<Upload className="h-4 w-4" />
										{newFile ? "Cambiar archivo" : "Cargar nuevo archivo (PDF)"}
									</Label>
								</div>
							</div>

							{/* DESCRIPCIÓN */}
							<div className="space-y-2">
								<Label>Descripción <span className="text-red-500">*</span></Label>
								<Textarea
									value={data.description}
									rows={4}
									onChange={(e) =>
										setData({ ...data, description: e.target.value })
									}
								/>
							</div>

							{/* COLORES DE TINTA */}
							<div>
								<Label>
									Color de tintas <span className="text-red-500">*</span>
									<span className="text-gray-600 ml-2">(máximo 4)</span>
								</Label>
								<div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mt-2">
									{Object.entries(tintColors).map(([key, value]) => (
										<div key={key} className="flex items-center space-x-2">
											<Checkbox
												checked={data.tint_colors.includes(parseInt(key))}
												onCheckedChange={(checked) => {
													const colorId = parseInt(key);
													const currentLength = data.tint_colors.length;
													
													// Validar que no se excedan 4 colores
													if (checked && currentLength >= 4) {
														return;
													}
													
													setData({
														...data,
														tint_colors: checked
															? [...data.tint_colors, colorId]
															: data.tint_colors.filter((t) => t !== colorId),
													});
												}}
											/>
											<span>{value}</span>
										</div>
									))}
								</div>
							</div>

							{/* BOTONES DE ACCIÓN */}
							<div className="flex justify-end gap-4 pt-4 border-t">
								<Button
									variant="outline"
									onClick={() => router.push(`/print-jobs/${id}/show`)}
								>
									Cancelar
								</Button>
								<Button onClick={handleSubmit}>Guardar cambios</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	);
};

export default PrintJobRequestEdit;