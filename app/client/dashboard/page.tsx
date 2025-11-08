"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, FileText, Plus } from "lucide-react"
import { mockRequests } from "@/lib/mock-data"
import { RequestsTable } from "@/components/requests-table"

export default function ClientDashboard() {
  // Mock: filter requests for current client (id: 2)
  const [requests] = useState(mockRequests.filter((r) => r.clientId === "2"))

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
              <p className="text-sm text-muted-foreground">Juan Pérez</p>
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
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Solicitudes Activas</CardDescription>
              <CardTitle className="text-3xl">{requests.filter((r) => r.status !== "terminada").length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>En Proceso</CardDescription>
              <CardTitle className="text-3xl">{requests.filter((r) => r.status === "en_proceso").length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completadas</CardDescription>
              <CardTitle className="text-3xl">{requests.filter((r) => r.status === "terminada").length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Mis Solicitudes de Impresión</CardTitle>
              <CardDescription>Visualiza y gestiona tus solicitudes de impresión 3D</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Solicitud
            </Button>
          </CardHeader>
          <CardContent>
            <RequestsTable requests={requests} isAdmin={false} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
