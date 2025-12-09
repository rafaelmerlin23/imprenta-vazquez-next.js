import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2,Eye } from "lucide-react"
import { ClientStatus,FormState,Client } from "@/lib/types"
import { useAppStore } from "@/app/stores/useAppStore"
import { useEffect, useState } from "react"
import { ErrorDialog } from "../error-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
 import axios from '@/lib/axios'

export function ClientsTable() {
  const { clients,setClientIdSelected,setClientStatus,setFormClientState,deleteClient} = useAppStore()
  const [isDeleteDialogOpen,setIsDeleteDialogOpen]= useState<boolean>(false)
  const [clientSelected,setClientSelected] = useState<Client | null>(null)
  const [isDeleting,setIsDeleting] = useState<boolean>(false)
  
  const [errorDialog,setErrorDialog] = useState<string >("")
  const [isOpenErrorDialog,setIsOpenErrorDialog] = useState<boolean>(false)
  
  const handleConfirmDelete =async ()=>{
    setIsDeleting(true);
    const response = await axios.delete(`/api/customers/${clientSelected?.id}`)
    .then(
      ()=>{
        setClientSelected(null);
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        if(clientSelected != null){
          deleteClient(clientSelected)
        }
      }
    ).catch((error)=>{
      setErrorDialog("Error al eliminar el cliente")
      setIsDeleteDialogOpen(false);
      setIsOpenErrorDialog(true);
      console.log(error);
    }) 
  } 

  return (
    <>
    <ErrorDialog
    description={errorDialog}
    isOpen = {isOpenErrorDialog}
    onClose={()=>{
      setIsOpenErrorDialog(false)
      setErrorDialog("");
      setIsDeleting(false);
    }}
    title="Error"

    />
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle
                        >¿Eliminar cliente?</DialogTitle>
                        <DialogDescription>
                            Esta acción no se puede deshacer. el cliente {clientSelected?.business_name} será eliminada
                            permanentemente del sistema.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={()=> setIsDeleteDialogOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Eliminando..." : "Eliminar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
                    <Button onClick={()=> {
                      setClientIdSelected(client.id)
                      setFormClientState(FormState.Edit)
                      setClientStatus(ClientStatus.Edit)
                    }} variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button onClick={()=>{
                      setClientSelected(client);
                      setIsDeleteDialogOpen(true);
                    }} variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button onClick={()=> {
                      setClientIdSelected(client.id)
                      setFormClientState(FormState.Show);
                      setClientStatus(ClientStatus.Show);
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
            </>
  )
}
