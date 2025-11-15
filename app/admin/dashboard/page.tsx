  "use client"

  import { useEffect, useState } from "react"
  import Link from "next/link"
  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
  import { LogOut, Users, FileText, Plus } from "lucide-react"
  import { mockRequests, mockUsers } from "@/lib/mock-data"
  import { RequestsTable } from "@/components/requests-table"
  import { ClientsTable } from "@/components/client-form/clients-table"
  import {Client,ClientStatus,FormState} from "@/lib/types"
  import axios from '@/lib/axios'
  import {DetailClient} from "@/components/client-form/detail-client"
  import {CreateClient} from "@/components/client-form/add-client"
  import {useAppStore } from "@/app/stores//useAppStore"

  export default function AdminDashboard() {
    const [requests] = useState(mockRequests)
    const {logout,clients,getClients,clientStatus,setClientStatus,setFormClientState} = useAppStore()

    const closeSession = ()=>{
      logout()
    }


  useEffect(() => {
      const handlePopState = () => {
        if (clientStatus !== ClientStatus.ShowAll) {
          setClientStatus(ClientStatus.ShowAll);

          window.history.pushState(null, "", window.location.href);
        }
      };
      
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }, [clientStatus]);

    useEffect(() => {
      if (clientStatus !== ClientStatus.ShowAll) {
        window.history.pushState({ clientStatus }, "", window.location.href);
      }
    }, [clientStatus]);

    useEffect(()=>{
      if(clients === null){
        getClients()
      }
    },[])


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
                <p className="text-sm text-muted-foreground">Gestiona clientes y solicitudes</p>
              </div>
            </div>
            <Link href="/">
              <Button onClick={()=>closeSession()} variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </Link>
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
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Solicitadas</CardDescription>
                    <CardTitle className="text-3xl">{requests.filter((r) => r.status === "solicitada").length}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Esperando Aceptación</CardDescription>
                    <CardTitle className="text-3xl">
                      {requests.filter((r) => r.status === "esperando_aceptacion").length}
                    </CardTitle>
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
                    <CardDescription>Terminadas</CardDescription>
                    <CardTitle className="text-3xl">{requests.filter((r) => r.status === "terminada").length}</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Todas las Solicitudes</CardTitle>
                  <CardDescription>Gestiona y actualiza el estado de las solicitudes de impresión</CardDescription>
                </CardHeader>
                <CardContent>
                  <RequestsTable requests={requests} isAdmin />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients" className="space-y-6">
              <Card>
   
              {clientStatus === ClientStatus.ShowAll    ? (
                <>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>Clientes Registrados</CardTitle>
                      <CardDescription>Administra las cuentas de clientes del sistema</CardDescription>
                    </div>
                    <Button onClick={() => {
                      setFormClientState(FormState.Create);
                      setClientStatus(ClientStatus.Show);
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nuevo Cliente
                    </Button>
                  </CardHeader>

                  <CardContent>
                    <ClientsTable />
                  </CardContent>
                </>
              ) : (
                <>
                <DetailClient />
                </>
              )}

              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    )
  }
