import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2,Eye } from "lucide-react"
import { ClientStatus } from "@/lib/types"
import { useAppStore } from "@/app/store"


export function ClientsTable() {
  const { clients,setClientIdSelected,setClientStatus} = useAppStore()
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>CURP</TableHead>
            <TableHead>Fecha de Registro</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No hay clientes registrados
              </TableCell>
            </TableRow>
          ) : (
            clients?.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-mono text-sm">#{client.id}</TableCell>
                <TableCell className="font-medium">{client.business_name}</TableCell>
                <TableCell>{client.rfc}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(client.created_at).toLocaleDateString("es-MX")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button onClick={()=> setClientStatus(ClientStatus.Edit)} variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button onClick={()=> setClientStatus(ClientStatus.Delete)} variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button onClick={()=> {
                      setClientIdSelected(client.id)
                      setClientStatus(ClientStatus.Show)
                    }} variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
