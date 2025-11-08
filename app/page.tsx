import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer, UserCog, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-primary p-6">
              <Printer className="h-16 w-16 text-primary-foreground" />
            </div>
          </div>

          <h1 className="mb-4 text-balance text-5xl font-bold tracking-tight">Sistema de Gestión de Impresiones</h1>

          <p className="mb-12 text-balance text-xl text-muted-foreground">
            Plataforma para administrar solicitudes de impresión 3D y gestionar clientes
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <UserCog className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Administrador</CardTitle>
                <CardDescription className="text-base">
                  Gestiona clientes, valida solicitudes y administra el flujo de trabajo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/login">
                  <Button size="lg" className="w-full">
                    Acceder como Admin
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-accent/10 p-4">
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Cliente</CardTitle>
                <CardDescription className="text-base">
                  Realiza solicitudes de impresión y da seguimiento a tus proyectos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/client/login">
                  <Button size="lg" variant="outline" className="w-full bg-transparent">
                    Acceder como Cliente
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
