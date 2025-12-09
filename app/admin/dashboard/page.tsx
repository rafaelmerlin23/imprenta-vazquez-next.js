"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Users, FileText, Plus } from "lucide-react";
import { RequestsTable } from "@/components/requests-table";
import { ClientsTable } from "@/components/client-form/clients-table";
import {
	Client,
	ClientStatus,
	FormState,
	PrintRequest,
	requestStatusOptions,
} from "@/lib/types";
import { FormClient } from "@/components/client-form/form-client";
import { CreateClient } from "@/components/client-form/add-client";
import { EditClient } from "@/components/client-form/edit-client";
import { useAppStore } from "@/app/stores//useAppStore";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/loading-spinner";

// Mapeo correcto de IDs a estados
const STATUS_MAP: Record<string, string> = {
	"1": "pending",
	"2": "waiting_acceptance",
	"3": "in_progress",
	"4": "completed",
};

export default function AdminDashboard() {
	const {
		token,
		requests,
		getRequests,
		logout,
		getClients,
		clientStatus,
		setClientStatus,
		setFormClientState,
		isLoadRequests,
	} = useAppStore();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [filterRequests, setFilterRequest] = useState<PrintRequest[]>([]);
	const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

	const closeSession = () => {
		logout(router);
	};

	const filterByStatus = (statusId: string | null) => {
		// Si clickean el mismo estado, lo deseleccionan
		if (selectedStatus === statusId) {
			setSelectedStatus(null);
			setFilterRequest([...requests]);
			return;
		}

		setSelectedStatus(statusId);

		if (statusId === null) {
			setFilterRequest([...requests]);
		} else {
			// Usar el mapeo correcto
			const actualStatus = STATUS_MAP[statusId];
			setFilterRequest([
				...requests?.filter((r: PrintRequest) => r.status === actualStatus),
			]);
		}
	};

	const cardClass = (status: string | null) => `
    cursor-pointer transition-all rounded-xl 
    ${
			selectedStatus === status
				? "bg-blue-200 border-1 border-blue-500 border-solid text-blue-500 font-bold shadow-lg scale-[1.02]"
				: "hover:bg-blue-100 hover:border-1 hover:border-blue-400"
		}
  `;

	const cardDescriptionClass = (status: string | null) => `
    font-medium text-xl ${
			selectedStatus === status ? "text-blue-500" : "text-black"
		}
  `;

	// Manejo del botón back del navegador
	useEffect(() => {
		const handlePopState = () => {
			if (clientStatus !== ClientStatus.ShowAll) {
				setClientStatus(ClientStatus.ShowAll);
				window.history.pushState(null, "", window.location.href);
			}
		};

		window.addEventListener("popstate", handlePopState);
		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, [clientStatus]);

	useEffect(() => {
		if (clientStatus !== ClientStatus.ShowAll) {
			window.history.pushState({ clientStatus }, "", window.location.href);
		}
	}, [clientStatus]);

	// Cargar datos iniciales - CORREGIDO
	useEffect(() => {
		const loadData = async () => {
			try {
				await getClients();
				await getRequests(setIsLoading);
			} catch (error) {
				console.error("Error cargando datos:", error);
				setIsLoading(false);
			}
		};

		loadData();
	}, []); // Solo se ejecuta al montar

	// Actualizar filtro cuando cambien las requests - CORREGIDO
	useEffect(() => {
		if (requests && requests.length >= 0) {
			// Si hay un filtro activo, reaplicarlo
			if (selectedStatus) {
				const actualStatus = STATUS_MAP[selectedStatus];
				setFilterRequest(
					requests.filter((r: PrintRequest) => r.status === actualStatus)
				);
			} else {
				setFilterRequest([...requests]);
			}
		}
	}, [requests]); // Solo depende de requests

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
							<h1 className="text-xl font-bold">Panel de Administración</h1>
							<p className="text-sm text-muted-foreground">
								Gestiona clientes y solicitudes
							</p>
						</div>
					</div>
					<Button onClick={() => closeSession()} variant="outline">
						<LogOut className="mr-2 h-4 w-4" />
						Cerrar Sesión
					</Button>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8">
				<Tabs defaultValue="requests" className="space-y-6">
					<TabsList className="grid w-full max-w-md grid-cols-2">
						<TabsTrigger value="requests" className="gap-2">
							<FileText className="h-4 w-4" />
							Solicitudes
						</TabsTrigger>
						<TabsTrigger value="clients" className="gap-2">
							<Users className="h-4 w-4" />
							Clientes
						</TabsTrigger>
					</TabsList>

					<TabsContent value="requests" className="space-y-6">
						<div className="grid gap-4 md:grid-cols-4">
							<Card
								className={cardClass("1")}
								onClick={() => filterByStatus("1")}
							>
								<CardHeader className="pb-3">
									<CardDescription className={cardDescriptionClass("1")}>
										Solicitadas
									</CardDescription>
									<CardTitle className="text-3xl">
										{
											requests?.filter(
												(r: PrintRequest) => r.status === "pending"
											).length
										}
									</CardTitle>
								</CardHeader>
							</Card>
							<Card
								className={cardClass("2")}
								onClick={() => filterByStatus("2")}
							>
								<CardHeader className=" pb-3">
									<CardDescription className={cardDescriptionClass("2")}>
										Esperando Aceptación
									</CardDescription>
									<CardTitle className="text-3xl">
										{
											requests?.filter(
												(r: PrintRequest) => r.status === "waiting_acceptance"
											).length
										}
									</CardTitle>
								</CardHeader>
							</Card>
							<Card
								className={cardClass("3")}
								onClick={() => filterByStatus("3")}
							>
								<CardHeader className="pb-3">
									<CardDescription className={cardDescriptionClass("3")}>
										En Proceso
									</CardDescription>
									<CardTitle className="text-3xl">
										{
											requests?.filter(
												(r: PrintRequest) => r.status === "in_progress"
											).length
										}
									</CardTitle>
								</CardHeader>
							</Card>
							<Card
								className={cardClass("4")}
								onClick={() => filterByStatus("4")}
							>
								<CardHeader className="pb-3">
									<CardDescription className={cardDescriptionClass("4")}>
										Terminadas
									</CardDescription>
									<CardTitle className="text-3xl">
										{
											requests?.filter(
												(r: PrintRequest) => r.status === "completed"
											).length
										}
									</CardTitle>
								</CardHeader>
							</Card>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Todas las Solicitudes</CardTitle>
								<CardDescription>
									Gestiona y actualiza el estado de las solicitudes de impresión
								</CardDescription>
							</CardHeader>
							<CardContent>
								<RequestsTable requests={filterRequests} />
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="clients" className="space-y-6">
						<Card>
							{(() => {
								switch (clientStatus) {
									case ClientStatus.ShowAll:
										return (
											<>
												<CardHeader className="flex flex-row items-center justify-between space-y-0">
													<div>
														<CardTitle>Clientes Registrados</CardTitle>
														<CardDescription>
															Administra las cuentas de clientes del sistema
														</CardDescription>
													</div>
													<Button
														onClick={() => {
															setClientStatus(ClientStatus.Create);
															setFormClientState(FormState.Create);
														}}
													>
														<Plus className="mr-2 h-4 w-4" />
														Nuevo Cliente
													</Button>
												</CardHeader>

												<CardContent>
													<ClientsTable />
												</CardContent>
											</>
										);
									case ClientStatus.Show:
										return (
											<>
												<FormClient />
											</>
										);
									case ClientStatus.Create:
										return <CreateClient />;
									case ClientStatus.Edit:
										return <EditClient />;
									default:
										return (
											<>
												<CardHeader className="flex flex-row items-center justify-between space-y-0">
													<div>
														<CardTitle>Clientes Registrados</CardTitle>
														<CardDescription>
															Administra las cuentas de clientes del sistema
														</CardDescription>
													</div>
													<Button onClick={() => {}}>
														<Plus className="mr-2 h-4 w-4" />
														Nuevo Cliente
													</Button>
												</CardHeader>

												<CardContent>
													<ClientsTable />
												</CardContent>
											</>
										);
								}
							})()}
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}
