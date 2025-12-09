import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import {Spinner} from "@/components/ui/spinner"
import {FieldGroup} from "@/components/ui/field"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from "@/components/ui/button"
import { X} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/app/stores/useAppStore"
import { FormState,ClientStatus, PrintRequest} from "@/lib/types"
import { TextFieldClient } from "./text-field-client"
import { RequestsTable } from "../requests-table"

export function FormClient(){
    const {setSelectedTab,selectedTab,setClientStatus,clientStatus,getClient, client,isLoading,requests,isLoadRequests} = useAppStore()
    const [filterRequests,setFilterRequest] = useState<PrintRequest[] | any>([])
    const goToAddress=()=>{
        setSelectedTab("Address")
    }
    
    useEffect(() => {
        if(ClientStatus.Create != clientStatus){
            getClient()
        }

    }, [])

    useEffect(()=>
    {
        if(isLoadRequests ){
            setFilterRequest([...requests.filter((r:PrintRequest)=> r.customer?.id == client?.id)])
        }
    },[isLoadRequests,client])
    
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
                  <Button onClick={()=>{
                    setClientStatus(ClientStatus.ShowAll)
                    }} variant="ghost" size="lg">
                      <X className="h-20 w-20 text-lg text-black" />
                    </Button>
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
                        <p className="text-lg mb-4">{client?.business_name}</p>
               
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
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-3 space-y-6">
                      
                            <TabsList className="mb-3 grid w-full max-w-md grid-cols-3">
                                <TabsTrigger value="Address" className="gap-2">
                                Dirección
                                </TabsTrigger>
                                <TabsTrigger  value="Requests" className="gap-2">
                                    Solicitudes
                                </TabsTrigger>
                                <TabsTrigger   value="Jobs" className="gap-2">
                                Trabajos realizados
                                </TabsTrigger>
                                
                            </TabsList>
                        <TabsContent value="Requests" className="space-y-6">
                                 <RequestsTable requests={filterRequests} />
                        </TabsContent>
                        <TabsContent value="Address" className="space-y-6">
                           <Card className="mt-0">
                            <CardHeader>
                             <CardTitle>Información de la dirección de cliente </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
            <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                
                <TextFieldClient
                    disabled
                    id="address"
                    label="Dirección"
                    placeholder={client?.customer_address.address}
                />
                <TextFieldClient
                    disabled
                    id="postalcode"
                    label="Código postal"
                    placeholder={client?.customer_address.postal_code}
                />

                </div>
                <div className="grid grid-cols-2 gap-4">
                
                <TextFieldClient
                    disabled
                    id="neighborhood"
                    label="Colonia"
                    placeholder={client?.customer_address.neighborhood}
                />
                
                <TextFieldClient
                    disabled
                    id="municipality"
                    label="Municipio"
                    placeholder={client?.customer_address.municipality}
                />
                
                </div>
                    <div className="grid grid-cols-2 gap-4">
                
                <TextFieldClient
                    disabled
                    id="locality"
                    label="Localidad"
                    placeholder={client?.customer_address.locality_name}
                />
                
                <TextFieldClient
                    disabled
                    id="federalEntity"
                    label="Entidad federal"
                    placeholder={client?.customer_address.federal_entity}
                />
                
                </div>
                    <div className="grid grid-cols-2 gap-4">
                <TextFieldClient
                    disabled
                    id="interiornumber"
                    label="Número interior"
                    placeholder={client?.customer_address.interior_number}
                />
                
                <TextFieldClient
                    disabled
                    id="exteriornumber"
                    label="Número exterior"
                    placeholder={client?.customer_address.exterior_number}
                />
                
                </div>
                <TextFieldClient
                    disabled
                    id="beweenstreets"
                    label="RFC"
                    placeholder={client?.rfc}
                />
                <TextFieldClient
                    disabled
                    id="beweenstreets"
                    label="Entre calles"
                    placeholder={client?.customer_address.between_streets}
                />
                
            </FieldGroup>
        </div>
                            </CardContent>
                           </Card>
                        </TabsContent>
                        <TabsContent value="Jobs" className="space-y-6">
                            chambas
                        </TabsContent>
                    </Tabs>
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