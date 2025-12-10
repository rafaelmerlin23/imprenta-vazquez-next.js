"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	FileText,
	ArrowLeft,
	Edit,
	Calendar,
	Clock,
	Tag,
	FileType,
	AlignLeft,
} from "lucide-react";
import axios from "@/lib/axios";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { TypeReceipt, User } from "@/lib/types";
import { useAppStore } from "@/app/stores/useAppStore";
import { formatDate } from "@/lib/helpers";
import Link from "next/link";

const TypeReceiptShow = () => {
	const router = useRouter();
	const { id } = useParams();
	const user: User | null = useAppStore((state) => state.currentLoginInfoUser);
	const token = useAppStore((state) => state.token);

	const [data, setData] = useState<TypeReceipt | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`/api/type-receipts/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setData(response.data.data);
			} catch (error) {
				console.error("Error al obtener el tipo de recibo:", error);
				router.push("/admin/dashboard");
			}
		};
		fetchData();
	}, [id, token, router]);

	if (!data) {
		return <LoadingSpinner variant="overlay" text="Cargando tipo de recibo..." />;
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
			{/* Header */}
			<header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm shadow-sm">
				<div className="container mx-auto flex items-center justify-between px-4 py-4">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => router.push("/admin/dashboard")}
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
										Tipo de recibo #{data.id}
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						{user?.is_admin && (
							<Link href={`/type-receipts/${id}/edit`}>
								<Button className="bg-blue-600 hover:bg-blue-500 text-white font-medium">
									<Edit className="h-4 w-4 mr-2" />
									Editar tipo de recibo
								</Button>
							</Link>
						)}
					</div>
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
											<Tag className="h-4 w-4" />
											Nombre
										</Label>
										<Input
											value={data.name}
											disabled
											className="bg-slate-50 font-medium"
										/>
									</div>

									<div className="space-y-2">
										<Label className="text-slate-600 flex items-center gap-2">
											<FileType className="h-4 w-4" />
											Categoría
										</Label>
										<Input
											value={data.receipt_category}
											disabled
											className="bg-slate-50 font-medium"
										/>
									</div>
								</div>

								<Separator />

								<div className="space-y-2">
									<Label className="text-slate-600 flex items-center gap-2">
										<AlignLeft className="h-4 w-4" />
										Descripción
									</Label>
									<div className="p-4 bg-slate-50 rounded-lg border">
										<p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
											{data.description || "Sin descripción"}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Columna lateral - Info adicional */}
					<div className="space-y-4">
						{/* Fechas */}
						<Card className="shadow-md border-slate-200">
							<CardHeader>
								<CardTitle className="text-lg">
									Información del registro
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
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
};

export default TypeReceiptShow;