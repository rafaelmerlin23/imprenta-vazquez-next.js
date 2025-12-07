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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	FileText,
	Eye,
	File,
	X,
	ArrowLeft,
	Edit,
	Calendar,
	Clock,
	Hash,
	FileType,
	Layers,
	Palette,
	Download,
	Maximize2,
} from "lucide-react";
import axios from "@/lib/axios";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { PrintJobRequest, User } from "@/lib/types";
import {
	typeReceiptOptions,
	copiesColors,
	paperSizeOptions,
	paperTypeOptions,
	tintColors,
} from "@/lib/types";
import { useAppStore } from "@/app/stores/useAppStore";
import { formatDate } from "@/lib/helpers";

const PrintJobRequestShow = () => {
	const router = useRouter();
	const { id } = useParams();
	const user: User | null = useAppStore((state) => state.currentLoginInfoUser);

	const [data, setData] = useState<PrintJobRequest | null>(null);
	const [showPreview, setShowPreview] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);

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
			estimated_date: data.estimated_date ?? "",
			price: data.price ? Number(data.price) : undefined,
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
			typeof filepath === "string"
				? filepath
				: filepath instanceof File
				? filepath.name
				: "";
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

	const getStatusBadge = (status: string) => {
		const statusMap: Record<
			string,
			{
				label: string;
				variant: "default" | "secondary" | "destructive" | "outline";
			}
		> = {
			"1": { label: "Pendiente", variant: "secondary" },
			"2": { label: "En proceso", variant: "default" },
			"3": { label: "Completada", variant: "outline" },
			"4": { label: "Cancelada", variant: "destructive" },
			"5": { label: "En revisión", variant: "secondary" },
		};

		const statusInfo = statusMap[status] || {
			label: "Desconocido",
			variant: "outline",
		};
		return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
	};

	const canEdit = () => {
		if (!data || !user || !user.customer) return false;
		const editableStatuses = [1, 2, 5];
		return (
			editableStatuses.includes(Number(data.status)) &&
			data.customer_id === String(user.customer.id)
		);
	};

	if (!data) {
		return <LoadingSpinner variant="overlay" text="Cargando solicitud..." />;
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
			{/* Header mejorado */}
			<header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm shadow-sm">
				<div className="container mx-auto flex items-center justify-between px-4 py-4">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => router.push("/client/dashboard")}
							className="rounded-full"
						>
							<ArrowLeft className="h-5 w-5" />
						</Button>

						<div className="flex items-center gap-3">
							<div className="rounded-sm border-b-2 border-amber-300 p-1">
								<FileText className="h-6 w-6 text-amber-500" />
							</div>
							<div>
								<h1 className="text-xl font-bold text-slate-900">
									{data.name}
								</h1>
								<div className="flex items-center gap-2 mt-1">
									<span className="text-sm text-slate-500">
										Solicitud #{data.id}
									</span>
									{getStatusBadge(data.status)}
								</div>
							</div>
						</div>
					</div>

					{canEdit() && (
						<Button
							onClick={() => router.push(`/print-jobs/${id}/edit`)}
							className="bg-amber-400 hover:bg-amber-500 text-black font-medium"
						>
							<Edit className="h-4 w-4 mr-2" />
							Editar solicitud
						</Button>
					)}
				</div>
			</header>

			<main className="container mx-auto max-w-6xl px-4 py-8">
				<div className="grid gap-6 lg:grid-cols-3">
					{/* Columna principal */}
					<div className="lg:col-span-2 space-y-6">
						{/* Información general */}
						<Card className="shadow-md border-slate-200">
							<CardHeader className="pb-4">
								<div className="flex items-center gap-2">
									<FileType className="h-5 w-5 text-amber-500" />
									<CardTitle className="text-lg">Información general</CardTitle>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label className="text-slate-600 flex items-center gap-2">
											<FileText className="h-4 w-4" />
											Tipo de solicitud
										</Label>
										<Input
											value={typeReceiptOptions[data.type_receipt_id]}
											disabled
											className="bg-slate-50 font-medium"
										/>
									</div>

									<div className="space-y-2">
										<Label className="text-slate-600 flex items-center gap-2">
											<Layers className="h-4 w-4" />
											Cantidad
										</Label>
										<Input
											value={`${data.quantity} unidad(es)`}
											disabled
											className="bg-slate-50 font-medium"
										/>
									</div>
								</div>

								{data.type_receipt_id === "1" && (
									<>
										<Separator />
										<div className="grid gap-4 md:grid-cols-2">
											<div className="space-y-2">
												<Label className="text-slate-600">
													Número de copias
												</Label>
												<Input
													value={data.copies_number}
													disabled
													className="bg-slate-50"
												/>
											</div>

											<div className="space-y-2">
												<Label className="text-slate-600 flex items-center gap-2">
													<Hash className="h-4 w-4" />
													Folio
												</Label>
												<Input
													value={data.folio}
													disabled
													className="bg-slate-50"
												/>
											</div>
										</div>

										<div className="space-y-3 pt-2">
											<Label className="text-slate-600 flex items-center gap-2">
												<Palette className="h-4 w-4" />
												Color de copias
											</Label>
											<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
												{Object.entries(copiesColors).map(([key, value]) => (
													<div
														key={key}
														className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
															data.copies_colors?.includes(Number(key))
																? "bg-amber-50 border-amber-400"
																: "bg-white border-slate-200"
														}`}
													>
														<Checkbox
															checked={data.copies_colors?.includes(
																Number(key)
															)}
															disabled
															className="data-[state=checked]:bg-amber-500"
														/>
														<span className="text-sm font-medium">{value}</span>
													</div>
												))}
											</div>
										</div>
									</>
								)}
							</CardContent>
						</Card>

						{/* Especificaciones de papel */}
						<Card className="shadow-md border-slate-200">
							<CardHeader className="pb-4">
								<div className="flex items-center gap-2">
									<File className="h-5 w-5 text-amber-500" />
									<CardTitle className="text-lg">
										Especificaciones de papel
									</CardTitle>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label className="text-slate-600">Tamaño de papel</Label>
										<Input
											value={paperSizeOptions[Number(data.paper_size)]}
											disabled
											className="bg-slate-50 font-medium"
										/>
									</div>

									<div className="space-y-2">
										<Label className="text-slate-600">Tipo de papel</Label>
										<Input
											value={paperTypeOptions[Number(data.paper_type)]}
											disabled
											className="bg-slate-50 font-medium"
										/>
									</div>
								</div>

								<div className="space-y-3 pt-2">
									<Label className="text-slate-600 flex items-center gap-2">
										<Palette className="h-4 w-4" />
										Color de tintas
									</Label>
									<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
										{Object.entries(tintColors).map(([key, value]) => (
											<div
												key={key}
												className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
													data.tint_colors.includes(parseInt(key))
														? "bg-amber-50 border-amber-400"
														: "bg-white border-slate-200"
												}`}
											>
												<Checkbox
													checked={data.tint_colors.includes(parseInt(key))}
													disabled
													className="data-[state=checked]:bg-amber-500"
												/>
												<span className="text-sm font-medium">{value}</span>
											</div>
										))}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Documento */}
						<Card className="shadow-md border-slate-200">
							<CardHeader className="pb-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<File className="h-5 w-5 text-amber-500" />
										<CardTitle className="text-lg">
											Documento de impresión
										</CardTitle>
									</div>
									{data.file_path && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setShowPreview(!showPreview)}
											className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
										>
											<Eye className="h-4 w-4 mr-2" />
											{showPreview ? "Ocultar" : "Ver vista previa"}
										</Button>
									)}
								</div>
							</CardHeader>
							<CardContent>
								{data.file_path ? (
									<div className="space-y-4">
										<div className="p-4 border-2 rounded-xl bg-linear-to-br from-slate-50 to-white hover:shadow-md transition-shadow">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div className="p-3 bg-amber-100 rounded-lg">
														<File className="h-6 w-6 text-amber-600" />
													</div>
													<div>
														<p className="text-sm font-semibold text-slate-900">
															{getFileName(data.file_path)}
														</p>
														<p className="text-xs text-slate-500 uppercase mt-1 font-medium">
															Archivo {getFileExtension(data.file_path)}
														</p>
													</div>
												</div>
												<Button
													variant="outline"
													size="sm"
													className="border-amber-200 hover:bg-amber-50"
													onClick={() =>
														window.open(data.file_path as string, "_blank")
													}
												>
													<Download className="h-4 w-4 mr-2" />
													Descargar
												</Button>
											</div>
										</div>

										{showPreview && (
											<div className="border-2 border-amber-400 rounded-xl overflow-hidden bg-white shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
												<div className="bg-linear-to-r from-amber-400 to-amber-500 px-4 py-3 flex items-center justify-between">
													<p className="text-sm font-semibold text-white flex items-center gap-2">
														<Eye className="h-4 w-4" />
														Vista previa: {getFileName(data.file_path)}
													</p>
													<div className="flex gap-2">
														<Button
															variant="ghost"
															size="sm"
															onClick={() => setIsFullscreen(!isFullscreen)}
															className="text-white hover:bg-amber-600"
														>
															<Maximize2 className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => setShowPreview(false)}
															className="text-white hover:bg-amber-600"
														>
															<X className="h-4 w-4" />
														</Button>
													</div>
												</div>

												<div
													className={`p-4 ${isFullscreen ? "h-screen" : ""}`}
												>
													<iframe
														src={data.file_path}
														className="w-full rounded-lg shadow-inner"
														style={{
															height: isFullscreen
																? "calc(100vh - 8rem)"
																: "600px",
														}}
														title="Vista previa del documento"
													/>
												</div>
											</div>
										)}
									</div>
								) : (
									<div className="p-8 border-2 border-dashed rounded-xl bg-slate-50 text-center">
										<FileText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
										<p className="text-sm text-slate-500 font-medium">
											No hay archivo adjunto en esta solicitud
										</p>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Descripción */}
						{data.description && (
							<Card className="shadow-md border-slate-200">
								<CardHeader className="pb-4">
									<CardTitle className="text-lg">
										Descripción adicional
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="p-4 bg-slate-50 rounded-lg border">
										<p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
											{data.description}
										</p>
									</div>
								</CardContent>
							</Card>
						)}
					</div>

					{/* Columna lateral - Info adicional */}
					<div className="space-y-6">
						{/* Estado y fechas */}
						<Card className="shadow-md border-slate-200">
							<CardHeader className="pb-4">
								<CardTitle className="text-lg">
									Información del pedido
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
										<Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
										<div className="flex-1">
											<p className="text-xs text-slate-500 font-medium mb-1">
												Fecha de creación
											</p>
											<p className="text-sm text-slate-900 font-semibold">
												{formatDate(data.created_at)}
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
										<Clock className="h-5 w-5 text-slate-500 mt-0.5" />
										<div className="flex-1">
											<p className="text-xs text-slate-500 font-medium mb-1">
												Última actualización
											</p>
											<p className="text-sm text-slate-900 font-semibold">
												{formatDate(data.updated_at)}
											</p>
										</div>
									</div>

									{data.estimated_date && (
										<div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
											<Clock className="h-5 w-5 text-amber-600 mt-0.5" />
											<div className="flex-1">
												<p className="text-xs text-amber-700 font-medium mb-1">
													Tiempo estimado
												</p>
												<p className="text-sm text-amber-900 font-semibold">
													{formatDate(data.estimated_date)}
												</p>
											</div>
										</div>
									)}
								</div>

								{data.price && (
									<>
										<Separator />
										<div className="p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
											<p className="text-xs text-green-700 font-medium mb-1">
												Cotización
											</p>
											<p className="text-2xl font-bold text-green-900">
												${data.price.toFixed(2)} MXN
											</p>
										</div>
									</>
								)}
							</CardContent>
						</Card>

						{/* Ayuda */}
						{user && user.customer && (
							<Card className="shadow-md border-amber-200 bg-linear-to-br from-amber-50 to-yellow-50">
								<CardHeader className="pb-3">
									<CardTitle className="text-base flex items-center gap-2">
										<FileText className="h-5 w-5 text-amber-600" />
										¿Necesitas ayuda?
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-slate-600 mb-4">
										Si tienes dudas sobre tu solicitud, contacta con nuestro
										equipo.
									</p>
									<Button
										variant="outline"
										className="w-full border-amber-400 hover:bg-amber-100"
									>
										Contactar soporte
									</Button>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</main>
		</div>
	);
};

export default PrintJobRequestShow;
