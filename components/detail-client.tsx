import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientData,ResponseClient } from "@/lib/types"
import { useEffect, useState } from "react"
import axios from '@/lib/axios'
import {Spinner} from "@/components/ui/spinner"
import {Field,FieldGroup,FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from "@/components/ui/button"
import { Pen} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/app/store"

export function DetailClient(){
    const {getClient, client,isLoading} = useAppStore()
    const [nalga,setNalga] = useState<number>(1);

    useEffect(() => {
        getClient()
    }, [])
    
    return(
        <>
        {
nalga
        }
       
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
                <Tabs defaultValue="Address" className="mt-3 space-y-6">
                           <TabsList className="mb-3 grid w-full max-w-md grid-cols-3">
                                <TabsTrigger value="Address" className="gap-2">
                                Dirección
                                </TabsTrigger>
                                <TabsTrigger value="Requests" className="gap-2">
                                Solicitudes
                                </TabsTrigger>
                                <TabsTrigger value="Jobs" className="gap-2">
                                Trabajos realizados
                                </TabsTrigger>
                                
                            </TabsList>
                        <TabsContent value="Requests" className="space-y-6">
                            solcitudes
                        </TabsContent>
                        <TabsContent value="Address" className="space-y-6">
                           <Card className="mt-0">
                            <CardHeader>
                             <CardTitle>Información de la dirección de cliente </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FieldGroup>
                                    <div className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                        Dirección
                                        </FieldLabel>
                                        <Input
                                        disabled
                                        id="checkout-7j9-card-name-43j"
                                        placeholder={client?.customer_address.address}
                                        required
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                        Código postal
                                        </FieldLabel>
                                        <Input
                                        disabled
                                        id="checkout-7j9-card-name-43j"
                                        placeholder={client?.customer_address.postal_code}
                                        required
                                        />
                                    </Field>
                                    </div>
                                     <div className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                        Colonia
                                        </FieldLabel>
                                        <Input
                                        disabled
                                        id="checkout-7j9-card-name-43j"
                                        placeholder={client?.customer_address.neighborhood}
                                        required
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                        Municipio
                                        </FieldLabel>
                                        <Input
                                        disabled
                                        id="checkout-7j9-card-name-43j"
                                        placeholder={client?.customer_address.municipality}
                                        required
                                        />
                                    </Field>
                                    </div>
                                     <div className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                        Localidad
                                        </FieldLabel>
                                        <Input
                                        disabled
                                        id="checkout-7j9-card-name-43j"
                                        placeholder={client?.customer_address.locality_name}
                                        required
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                        Entidad federativa
                                        </FieldLabel>
                                        <Input
                                        disabled
                                        id="checkout-7j9-card-name-43j"
                                        placeholder={client?.customer_address.federal_entity}
                                        required
                                        />
                                    </Field>
                                    </div>
                                     <div className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                        Numero interior
                                        </FieldLabel>
                                        <Input
                                        disabled
                                        id="checkout-7j9-card-name-43j"
                                        placeholder={client?.customer_address.interior_number}
                                        required
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                        Numero exterior
                                        </FieldLabel>
                                        <Input
                                        disabled
                                        id={client?.customer_address.exterior_number}
                                        placeholder="96896"
                                        required
                                        />
                                    </Field>
                                    </div>
                                    <Field>
                                        <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                        Entre calles
                                        </FieldLabel>
                                        <Input
                                        className="input-test"
                                        disabled
                                        id={client?.customer_address.between_streets}
                                        placeholder="96896"
                                        required
                                        />
                                    </Field>
                                </FieldGroup>
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