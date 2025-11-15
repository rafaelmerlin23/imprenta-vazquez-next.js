import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import axios from '@/lib/axios'
import {Spinner} from "@/components/ui/spinner"
import {Field,FieldGroup,FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from "@/components/ui/button"
import { Pen,X,Check} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/app/stores/useAppStore"
import {ClientDetailForm} from "@/components/client-form/client-detail-form"
import { FormState,ClientStatus} from "@/lib/types"

export function DetailClient(){
    const {setSelectedTab,selectedTab,getClient, client,isLoading,formClientState,setFormClientState} = useAppStore()
    
    const goToAddress=()=>{
        setSelectedTab("Address")
    }
    
    useEffect(() => {
        getClient()
    }, [])
    
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
                        {
                            formClientState !== FormState.Create &&
                            (formClientState === FormState.Edit ? (
                    <div className="flex justify-end gap-2">
                        {/* Cancelar */}
                        <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => setFormClientState(FormState.Show)}
                        className="text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                        >
                        <X className="h-4 w-4" />
                        </Button>

                        {/* Guardar */}
                        <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => console.log("Guardar cambios")}
                        className="text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors"
                        >
                        <Check className="h-4 w-4" />
                        </Button>
                    </div>
                    ) : (
                    <Button
                        onClick={() => {
                        goToAddress()
                        setFormClientState(FormState.Edit)
                        }}
                        variant="ghost"
                        size="lg"
                    >
                        <Pen className="h-4 w-4" />
                    </Button>
                    ))
                        }


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
                           {
                            formClientState !== FormState.Create&&
                            <TabsList className="mb-3 grid w-full max-w-md grid-cols-3">
                                <TabsTrigger value="Address" className="gap-2">
                                Dirección
                                </TabsTrigger>
                                <TabsTrigger disabled={FormState.Edit === formClientState} value="Requests" className="gap-2">
                                Solicitudes
                                </TabsTrigger>
                                <TabsTrigger disabled={FormState.Edit === formClientState}  value="Jobs" className="gap-2">
                                Trabajos realizados
                                </TabsTrigger>
                                
                            </TabsList>
                           }
                        <TabsContent value="Requests" className="space-y-6">
                            solcitudes
                        </TabsContent>
                        <TabsContent value="Address" className="space-y-6">
                           <Card className="mt-0">
                            <CardHeader>
                             <CardTitle>Información de la dirección de cliente </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ClientDetailForm/>
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