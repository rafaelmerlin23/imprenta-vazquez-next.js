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
import LoadingSpinner from "@/components/ui/loading-spinner";
import { User } from "@/lib/types";
import { useAppStore } from "@/app/stores/useAppStore";

export default function ClientDashboard() {
    const [requests, setRequests] = useState([]);
    const user: User | null = useAppStore((state) => state.currentLoginInfoUser);
    const [isLoading, setIsLoading] = useState(true);
    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}api/print-jobs`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${useAppStore.getState().token}`,
                    },
                }
            );
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
        fetchData();
    }, []);
    if (isLoading) {
        return <LoadingSpinner />;
    }
    if (!user) {
        return <div>No se encontró el usuario</div>;
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
                            <p className="text-sm text-muted-foreground">{user?.customer?.business_name}</p>
                        </div>
                    </div>
                    <Link href="/">
                        <Button variant="outline">
                            <LogOut className="mr-2 h-4 w-4" />
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
                        <RequestsTable requests={requests} isAdmin={false} user={user} />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}