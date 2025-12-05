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
import { LogOut, FileText, Plus } from "lucide-react";
import { RequestsTable } from "@/components/requests-table";
import axios from "@/lib/axios";
import { User } from "@/lib/mock-data";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useAppStore } from "@/app/stores/useAppStore";
import { useRouter } from "next/navigation"

export default function ClientDashboard() {
	const [requests, setRequests] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const {logout,token,currentLoginInfoUser} = useAppStore()
	const router = useRouter()

	const fetchRequests = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get("/api/print-jobs", {
        	headers: { Authorization: `Bearer ${token}` },
      		})
			console.log("respuesta ",response)
			setRequests(response.data);
		} catch (error) {
			console.error("Error fetching print job requests:", error);
		} finally {
			setIsLoading(false);
		}
	};


	useEffect(() => {
		const fetchData = async () => {
			await fetchRequests();
		};
		if(token!= null && currentLoginInfoUser != null){
			fetchData();
		}
	}, [token,currentLoginInfoUser]);

	if (isLoading) {
		return <LoadingSpinner />;
	}
	
	return (
		<div className="min-h-screen bg-background">
			<header className="border-b bg-card">
				<div className="container mx-auto flex items-center justify-between px-4 py-4">
					<div className="flex items-center gap-3">
						<div className="rounded-lg bg-accent p-2">
							<FileText className="h-6 w-6 text-accent-foreground" />
						</div>
						<div>
							<h1 className="text-xl font-bold">Mis Solicitudes</h1>
							<p className="text-sm text-muted-foreground">{currentLoginInfoUser?.customer?.business_name}</p>
						</div>
					</div>
					<Link href="/">
						<Button variant="outline">
							<LogOut 
							onClick={()=> logout(router)}
							className="mr-2 h-4 w-4" />
							Cerrar Sesión
						</Button>
					</Link>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8 space-y-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0">
						<div>
							<CardTitle>Mis Solicitudes de Impresión</CardTitle>
							<CardDescription>
								Visualiza y gestiona tus solicitudes de impresión
							</CardDescription>
						</div>
						<Link href="/print-jobs/create">
							<Button>
								<Plus className="mr-2 h-4 w-4" />
								Nueva Solicitud
							</Button>
						</Link>
					</CardHeader>
					<CardContent>
						<RequestsTable requests={requests} isAdmin={currentLoginInfoUser?.isAdmin ?? false} />
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
