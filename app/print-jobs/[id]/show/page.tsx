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
import { FileText, Eye, File, X } from "lucide-react";
import axios from "@/lib/axios";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { PrintJobRequest } from "@/lib/types";
import { typeReceiptOptions, copiesColors, paperSizeOptions, paperTypeOptions, tintColors } from "@/lib/types";

const PrintJobRequestShow = () => {
	const router = useRouter();
	const { id } = useParams();

	const [data, setData] = useState<PrintJobRequest | null>(null);
	const [showPreview, setShowPreview] = useState(false);

	const normalizePrintRequest = (data: any): PrintJobRequest => {
		return {
			id: data.id ?? "",
			customer_id: String(data.customer_id ?? ""),
			name: data.name ?? "",
			folio: data.folio ?? "",
			type_receipt_id: String(data.type_receipt_id ?? ""),
			paper_size: data.paper_size ?? "1",
			paper_type: data.paper_type ?? "1",
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
			status: data.status ?? "1",
			estimated_time: data.estimated_time ?? "",
			quotation: data.quotation ? Number(data.quotation) : undefined,
			created_at: data.created_at ?? "",
			updated_at: data.updated_at ?? "",
			payment_method: data.payment_method ?? undefined,
		};
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`/api/print-jobs/${id}`);
				const normalized = normalizePrintRequest(response.data);
				setData(normalized);
			} catch (error) {
				console.error("Error al obtener la solicitud:", error);
			}
		};
		fetchData();
	}, [id]);

	const getFileExtension = (filepath: string | File | null) => {
		const filename =
			typeof filepath === "string" ? filepath :
			filepath instanceof File ? filepath.name :
			"";
		return filename.split(".").pop()?.toLowerCase() || "";
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

	const isImageFile = (filepath: string | File | null) => {
		const ext = getFileExtension(filepath);
		return ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext);
	};

	const isPdfFile = (filepath: string | File | null) => {
		return getFileExtension(filepath) === "pdf";
	};

	const getFileUrl = (filepath: string | File | null) => {
		if (filepath instanceof File) {
			return URL.createObjectURL(filepath);
		}
		if (typeof filepath === "string") {
			return `${process.env.NEXT_PUBLIC_BACKEND_URL}${filepath}`;
		}
		return "";
	};

	if (!data) {
		return <LoadingSpinner variant="overlay" text="Cargando solicitud..." />;
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
				<Card>
					<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
						<div>
							<CardTitle className="text-2xl">Solicitud de impresión</CardTitle>
							<CardDescription className="mt-2">
								Información registrada
							</CardDescription>
						</div>
						<Button
							variant="default"
							onClick={() => router.push(`/print-jobs/${id}/edit`)}
						>
							Editar
						</Button>
					</CardHeader>

					<CardContent>
						<div className="space-y-6">
							{/* NOMBRE */}
							<div className="space-y-2">
								<Label>Nombre de la solicitud</Label>
								<Input value={data.name} disabled />
							</div>

							{/* TIPO / CANTIDAD */}
							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Tipo</Label>
									<Input
										value={typeReceiptOptions[Number(data.type_receipt_id)]}
										disabled
									/>
								</div>

								<div className="space-y-2">
									<Label>Cantidad</Label>
									<Input value={data.quantity} disabled />
								</div>
							</div>

							{/* CAMPOS SOLO SI ES TIPO 1 */}
							{data.type_receipt_id === "1" && (
								<>
									<div className="grid gap-6 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Número de copias</Label>
											<Input value={data.copies_number} disabled />
										</div>

										<div className="space-y-2">
											<Label>Folio</Label>
											<Input value={data.folio} disabled />
										</div>
									</div>

									{/* COLORES DE COPIA */}
									<div>
										<Label>Color de copias</Label>
										<div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mt-2">
											{Object.entries(copiesColors).map(([key, value]) => (
												<div key={key} className="flex items-center space-x-2">
													<Checkbox
														checked={data.copies_colors?.includes(Number(key))}
														disabled
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
									<Label>Tamaño de papel</Label>
									<Input value={paperSizeOptions[Number(data.paper_size)]} disabled />
								</div>

								<div className="space-y-2">
									<Label>Tipo de papel</Label>
									<Input value={paperTypeOptions[Number(data.paper_type)]} disabled />
								</div>
							</div>

							{/* ARCHIVO CON VISTA PREVIA */}
							<div className="space-y-3">
								<Label>Documento de impresión</Label>

								{data.file_path ? (
									<div className="space-y-3">
										{/* Card del archivo */}
										<div className="p-4 border rounded-lg bg-gray-50">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div className="p-2 bg-blue-100 rounded">
														<File className="h-5 w-5 text-blue-600" />
													</div>
													<div>
														<p className="text-sm font-medium">
															{getFileName(data.file_path)}
														</p>
														<p className="text-xs text-gray-500 uppercase">
															{getFileExtension(data.file_path)}
														</p>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<Button
														variant="ghost"
														size="sm"
														onClick={() => setShowPreview(!showPreview)}
														className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
													>
														<Eye className="h-4 w-4 mr-2" />
														{showPreview ? "Ocultar" : "Ver"}
													</Button>
												</div>
											</div>
										</div>

										{/* Vista previa */}
										{showPreview && (
											<div className="border-2 border-blue-500 rounded-lg overflow-hidden bg-white">
												<div className="bg-blue-50 px-4 py-2 flex items-center justify-between border-b">
													<p className="text-sm font-medium text-blue-900">
														Vista previa del documento
														{getFileName(data.file_path)}
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
														src={data.file_path}
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
							</div>

							{/* DESCRIPCIÓN */}
							<div className="space-y-2">
								<Label>Descripción</Label>
								<Textarea value={data.description} rows={4} disabled />
							</div>

							{/* COLORES DE TINTA */}
							<div>
								<Label>Color de tintas</Label>
								<div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mt-2">
									{Object.entries(tintColors).map(([key, value]) => (
										<div key={key} className="flex items-center space-x-2">
											<Checkbox
												checked={data.tint_colors.includes(parseInt(key))}
												disabled
											/>
											<span>{value}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	);
};

export default PrintJobRequestShow;
