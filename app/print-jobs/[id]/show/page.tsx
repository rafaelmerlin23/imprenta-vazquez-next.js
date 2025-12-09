"use client";

import { use, useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
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
	CreditCard,
	CheckCircle2,
} from "lucide-react";
import axios from "@/lib/axios";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
	PaymentMethod,
	PrintJobRequest,
	User,
	paymentMethodLabels,
} from "@/lib/types";
import {
	copiesColors,
	paperSizeOptions,
	paperTypeOptions,
	tintColors,
} from "@/lib/types";
import { useAppStore } from "@/app/stores/useAppStore";
import { formatDate } from "@/lib/helpers";
import RejectionAlert from "@/components/print-jobs/rejection-alert";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";
import { getFileName } from "@/lib/helpers";
import { AddPaymentModal } from "@/components/print-jobs/add-payment-modal";
import { ErrorDialog } from "@/components/error-dialog";

const PrintJobRequestShow = () => {
	const router = useRouter();
	const { id } = useParams();
	const user: User | null = useAppStore((state) => state.currentLoginInfoUser);

	const [data, setData] = useState<PrintJobRequest | null>(null);
	const [showPreview, setShowPreview] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [paymentAmount, setPaymentAmount] = useState("");
	const [paymentFile, setPaymentFile] = useState<File | null>(null);
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);
	const [showErrorDialog, setShowErrorDialog] = useState(false);
	const [errorDialogTexts, setErrorDialogTexts] = useState({
		title: "",
		description: "",
	});
	const token = useAppStore((state) => state.token);

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
			reason_rejection: data.reason_rejection ?? undefined,
			payments: data.payments ?? [],
			type_receipt: data.type_receipt ?? undefined,
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

	const canEdit = () => {
		if (!data || !user || !user.customer) return false;
		const editableStatuses = ["pending", "declined", "waiting_acceptance"];
		return (
			editableStatuses.includes(data.status) &&
			data.customer_id === String(user.customer.id)
		);
	};

	const getRemainingAmount = () => {
		if (!data?.price || !data?.payments) return 0;
		const totalPaid = data.payments.reduce(
			(sum, payment) => sum + Number(payment.amount),
			0
		);
		return data.price - totalPaid;
	};

	const handleAddPayment = async () => {
		if (!data) return;
		if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
			setErrorDialogTexts({
				title: "Monto inválido",
				description: "Ingresa un monto válido para el pago.",
			});
			setShowErrorDialog(true);
			return;
		}
		
		if (parseFloat(paymentAmount) > getRemainingAmount()) {
			setErrorDialogTexts({
				title: "Monto excede saldo pendiente",
				description: "El monto del pago no puede exceder el saldo pendiente.",
			});
			setShowErrorDialog(true);
			return;
		}
		
		if (!paymentFile) {
			setErrorDialogTexts({
				title: "Comprobante faltante",
				description: "Adjunta el comprobante de pago.",
			});
			setShowErrorDialog(true);
			return;
		}
		
		setIsProcessingPayment(true);
		try {
			const formData = new FormData();
			formData.append("payment_method", "1"); // parcial
			formData.append("print_job_request_id", String(data.id));
			
			formData.append("payment_amount", paymentAmount);
			if (paymentFile) {
				formData.append("payment_file", paymentFile);
			}

			const response = await axios.post(`/api/print-jobs-payments`, formData, {
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.status === 201) {
				setShowPaymentModal(false);
				window.location.reload();
			}
		} catch (error: any) {
			console.error("Error al agregar pago:", error);
			setErrorDialogTexts({
				title: "Error al registrar el pago",
				description: error.response?.data?.message || "Error al registrar el pago",
			});
			setShowErrorDialog(true);
		} finally {
			setIsProcessingPayment(false);
		}
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
							onClick={() => router.push(user?.isAdmin ? "/admin/dashboard" : "/client/dashboard")}
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
									<StatusBadge status={data.status} />
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						{/* Botón de agregar pago - solo si hay saldo pendiente y está accepted/in_progress */}
						{!user?.isAdmin &&
							getRemainingAmount() > 0 &&
							!data.is_paid &&
							(data.status === "accepted" || data.status === "in_progress") && (
								<Button
									onClick={() => setShowPaymentModal(true)}
									className="bg-green-600 hover:bg-green-500 text-white font-medium"
								>
									<CreditCard className="h-4 w-4 mr-2" />
									Agregar pago
								</Button>
							)}

						{canEdit() && (
							<Link href={`/print-jobs/${id}/edit`}>
								<Button className="bg-blue-600 hover:bg-blue-500 text-white font-medium">
									<Edit className="h-4 w-4 mr-2" />
									Editar solicitud
								</Button>
							</Link>
						)}
					</div>
				</div>
			</header>

			<main className="container mx-auto max-w-6xl px-4 py-8">
				{data.status === "declined" && !user?.isAdmin && (
					<div className="mb-6">
						<RejectionAlert
							requestId={data.id}
							reasonRejection={data.reason_rejection}
						/>
					</div>
				)}
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
											value={data.type_receipt?.name}
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
											value={`${data.quantity > 1 ? `${data.quantity} unidades` : `${data.quantity} unidad`}`}
											disabled
											className="bg-slate-50 font-medium"
										/>
									</div>
								</div>

								{data.type_receipt?.receipt_category === "Impresión" && (
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
					</div>

					{/* Columna lateral - Info adicional */}
					<div className="space-y-4">
						{/* Estado y fechas */}
						<Card className="shadow-md border-slate-200">
							<CardHeader>
								<CardTitle className="text-lg">
									Información del pedido
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
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
									<div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
										<Clock className="h-5 w-5 text-slate-500 mt-0.5" />
										<div className="flex-1">
											<p className="text-xs text-slate-500 font-medium mb-1">
												Tiempo estimado
											</p>
											<p className="text-sm text-slate-900 font-semibold">
												{formatDate(data.estimated_date)}
											</p>
										</div>
									</div>
								)}

								{data.price && (
									<div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
										<div className="h-5 w-5 text-slate-500 mt-0.5 flex items-center justify-center font-bold text-lg">
											$
										</div>
										<div className="flex-1">
											<p className="text-xs text-slate-500 font-medium mb-1">
												Cotización
											</p>
											<p className="text-sm text-slate-900 font-semibold">
												${data.price.toFixed(2)} MXN
											</p>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

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

						{/* Pagos */}
						{data.payments && data.payments.length > 0 && (
							<Card className="shadow-md border-slate-200">
								<CardHeader className="pb-4">
									<div className="flex items-center gap-2">
										<CreditCard className="h-5 w-5 text-amber-500" />
										<CardTitle className="text-lg">Pagos realizados</CardTitle>
									</div>
									<CardDescription>
										Historial de pagos de esta solicitud
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									{data.payments.map((payment, index) => (
										<div
											key={payment.id}
											className="p-4 bg-slate-50 rounded-lg border hover:border-amber-300 transition-colors"
										>
											<div className="flex items-start justify-between mb-3">
												<div className="flex items-center gap-2">
													<CheckCircle2 className="h-4 w-4 text-green-600" />
													<span className="text-xs font-semibold text-slate-900">
														Pago #{index + 1}
													</span>
												</div>
												<span className="text-sm font-bold text-green-700">
													${Number(payment.amount).toFixed(2)} MXN
												</span>
											</div>

											<div className="space-y-2 text-xs">
												<div className="flex justify-between">
													<span className="text-slate-500">Método:</span>
													<span className="font-medium text-slate-900">
														{
															paymentMethodLabels[
																payment.payment_method as PaymentMethod
															]
														}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-slate-500">Fecha de pago:</span>
													<span className="font-medium text-slate-900">
														{formatDate(payment.paid_at)}
													</span>
												</div>
											</div>

											{payment.file_path && (
												<Button
													variant="outline"
													size="sm"
													className="w-full mt-3 border-amber-200 hover:bg-amber-50 text-xs"
													onClick={() =>
														window.open(
															`http://localhost:8000/payment-files/${payment.file_path}`,
															"_blank"
														)
													}
												>
													<Download className="h-3 w-3 mr-2" />
													Ver comprobante
												</Button>
											)}
										</div>
									))}

									{/* Resumen de pagos */}
									<div className="pt-3 border-t">
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium text-slate-600">
												Total pagado:
											</span>
											<span className="text-lg font-bold text-green-700">
												$
												{data.payments
													.reduce(
														(sum, payment) => sum + Number(payment.amount),
														0
													)
													.toFixed(2)}{" "}
												MXN
											</span>
										</div>
										{data.price && (
											<div className="flex justify-between items-center mt-2">
												<span className="text-sm font-medium text-slate-600">
													Restante:
												</span>
												<span
													className={`text-lg font-bold ${
														data.price -
															data.payments.reduce(
																(sum, payment) => sum + Number(payment.amount),
																0
															) <=
														0
															? "text-green-700"
															: "text-amber-700"
													}`}
												>
													$
													{(
														data.price -
														data.payments.reduce(
															(sum, payment) => sum + Number(payment.amount),
															0
														)
													).toFixed(2)}{" "}
													MXN
												</span>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</main>
			{showErrorDialog && (
				<ErrorDialog
					isOpen={showErrorDialog}
					onClose={() => setShowErrorDialog(false)}
					title={errorDialogTexts.title}
					description={errorDialogTexts.description}
				/>
			)}
			<AddPaymentModal
				isOpen={showPaymentModal}
				onClose={() => {
					setShowPaymentModal(false);
					setPaymentAmount("");
					setPaymentFile(null);
				}}
				onConfirm={handleAddPayment}
				request={data}
				paymentAmount={paymentAmount}
				onPaymentAmountChange={setPaymentAmount}
				paymentFile={paymentFile}
				onPaymentFileChange={setPaymentFile}
				isProcessing={isProcessingPayment}
				remainingAmount={getRemainingAmount()}
			/>
		</div>
	);
};

export default PrintJobRequestShow;
