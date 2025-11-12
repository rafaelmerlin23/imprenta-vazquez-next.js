import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientData,ResponseClient } from "@/lib/types"
import { useEffect, useState } from "react"
import axios from '@/lib/axios'
import {Spinner} from "@/components/ui/spinner"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from "@/components/ui/button"
import { Pen} from "lucide-react"
interface ClientsDetailProps {
  ClientId: Number ,
}
export function DetailClient({ ClientId }: ClientsDetailProps){
    const [client,setClient] = useState<ClientData | null>(null);
    const [isLoading,setIsloading] = useState(false);

    useEffect(()=>{
    
    if(client === null){
        setIsloading(true);
        axios.get(`/api/customers/${ClientId}`, {
        headers: {
        'Authorization':`Bearer ${localStorage.getItem("token")}`
        }
        })
        .then(response => {
            let result:ResponseClient = response.data;
            setClient(result.data);
            setIsloading(false);
        })
        .catch(error => {
        console.error('Error:', error);});
    }
     },[])
     
    return(
        <>
        {
        !isLoading ? (
        <>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
            <CardTitle>Detalle de cliente </CardTitle>
            <CardDescription>Visualiza la información del cliente {client?.business_name} </CardDescription>
            </div>
            </CardHeader>
            <CardContent>
                <Card>
                <CardContent >
                    <div className="flex flex-row w-full">
                        <Avatar className="h-20 w-35">
                        <AvatarImage src="/user-place-holder.png" alt="Usuario" />
                        <AvatarFallback>US</AvatarFallback>
                        </Avatar>
                        <div className="flex  w-full flex-col">
                        <div className="flex w-full justify-between">
                        <p className="text-lg">{client?.business_name}</p>
                          <Button  variant="ghost" size="lg">
                            <Pen  className="mr-2 h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-row justify-between w-full"> 
                            <div className="flex flex-col">
                                    <p className="text-zinc-500 font-medium">
                                        Representante legal
                                    </p>
                                    <p className="">
                                        {client?.representative_name}
                                    </p>
                            </div>
                            <div className="flex flex-col">
                            <p className="text-zinc-500 font-medium">
                                        Número de Teléfono
                                    </p>
                                    <p className="">
                                        {client?.phone_number}
                                    </p>
                            </div>
                            <div className="flex flex-col">
                                    <p className="text-zinc-500 font-medium">
                                        Nombre de usuario
                                    </p>
                                    <p className="">
                                        {client?.user.username}
                                    </p>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-zinc-500 font-medium">
                                        Correo
                                    </p>
                                    <p className="">
                                        {client?.user.email}
                                    </p>
                            </div>
                        </div>
                        </div>
                        
                    </div>
                </CardContent>
                </Card>
            </CardContent>
        </>
            ):(
          <div className="w-full h-50 flex justify-center items-center">
            <Spinner className="w-20 h-20"/>
        </div>
        )
        }
        </>
    )
}