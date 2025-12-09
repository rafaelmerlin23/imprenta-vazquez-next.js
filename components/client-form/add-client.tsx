"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {FieldGroup, FieldLabel} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/app/stores/useAppStore"
import { ClientStatus} from "@/lib/types"
import { TextFieldClient } from "./text-field-client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ClientSchema, ClientFormData } from "@/lib/validations/clientSchema"
import { useState } from "react"
import axios from "@/lib/axios"
import { toast } from "sonner"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export const searchPostalCode = async (cp: string) => {
  try {
    const response = await fetch(
      `https://api.copomex.com/query/info_cp/${cp}?token=${process.env.NEXT_PUBLIC_TOKEN_DIRECTION}`
    );
    
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      toast.error("Código postal no encontrado");
      return null;
    }

    const colonias = data.map((item: any) => item.response.asentamiento);

    const info = data[0].response;

    return {
      cp: info.cp,
      estado: info.estado,
      municipio: info.municipio,
      ciudad: info.ciudad,
      colonias, 
    };

  } catch (error) {
    toast.error("Error al buscar el código postal");
    return null;
  }
};

export function CreateClient(){
  const {setClientStatus,token,getClients,setClients} = useAppStore()
  const [isLoading,setIsLoading] = useState<boolean>()
  const [colonies, setcolonies] = useState<string[]>([]);




  
  const {
    register,
    handleSubmit,
    setValue,
    formState:{errors},
  } = useForm<ClientFormData>({
    resolver:zodResolver(ClientSchema)
  })

  const onSubmit = async (data:ClientFormData)=>{
    
    setIsLoading(true);
    console.log(data)
    const newClient = {
        username:data.username,
        email:data.email,
        password:data.password,
        password_confirmation:data.confirmPassword,
        postal_code:data.postalcode,
        address:data.address,
        locality_name:data.locality,
        federal_entity:data.federalEntity,
        neighborhood:data.neighborhood,
        municipality:data.municipality,
        between_streets:data.betweenstreets,
        interior_number:data.interiornumber,
        exterior_number:data.exteriornumber,
        business_name:data.businessName,
        representative_name:data.representativeName,
        rfc:data.rfc,
        phone_number:data.phoneNumber
    }
    try {
    const response = await axios.post(
    "/api/customers",
    newClient, 
    {
        headers: {
        Authorization: `Bearer ${token}`
        }
    }
    )

      console.log("creado",response)
      toast.success("Cliente creado", 
            {

          description: "cliente creado con éxito",
          
          action: {
            label: "Ok",
            onClick: () => console.log("Undo"),
          },
        })
        setClients([])
        getClients()
        setClientStatus(ClientStatus.ShowAll)
        
    } catch (err:any) {

        const message = err.response?.data?.message || "Error al crear cliente"

        toast.error("Error", 
            {

          description: message,
          
          action: {
            label: "Ok",
            onClick: () => console.log("Undo"),
          },
        })

    }finally{
        setIsLoading(false)
    }
  }

    
    return(
        <>
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
            <CardTitle>Nuevo cliente </CardTitle>
            <CardDescription>Ingrese los datos del nuevo cliente  </CardDescription>
            </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="mb-4">
                    <CardHeader>
                    <CardTitle>Información del cliente</CardTitle>

                    </CardHeader>
                <CardContent >
               
                        <div className="flex  w-full flex-col">
                        <div className="flex w-full justify-between">
                          <div className="flex w-full flex-col pb-3">
                        
                              <TextFieldClient
                id="businessName"
                label="Nombre de la empresa"
                placeholder="Tochito INC"
                register={register}
                error={errors.businessName}
              />
                          </div>

                        </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
                <TextFieldClient id="representativeName" label="Representante legal" register={register} error={errors.representativeName} placeholder="Juan Pérez" />
                <TextFieldClient id="phoneNumber" label="Número de Teléfono" register={register} error={errors.phoneNumber} placeholder="924139543" />
                
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <TextFieldClient className="mt-4" id="email" label="correo electrónico" register={register} error={errors.email} type="email" placeholder="henryfrans@gmail.com" />
                <TextFieldClient className="mt-4" id="username" label="Nombre de usuario" register={register} error={errors.username} placeholder="henryfv" />
              </div>

                <TextFieldClient className="mt-4" id="rfc" label="RFC" register={register} error={errors.rfc} placeholder="MEPR0303212M0" />
              <div className="grid grid-cols-2 gap-3 mt-4">
                <TextFieldClient  type="password" id="password" label="Contraseña" register={register} error={errors.password} placeholder="*******" />
                <TextFieldClient type="password" id="confirmPassword" label="Confirmar contraseña" register={register} error={errors.confirmPassword} placeholder="*******" />
              </div>    
                        
                    </div>
                    
                </CardContent>
                </Card>
                           
                        
          <Card className="mt-0">
          <CardHeader>
            <CardTitle>Información de dirección </CardTitle>
          </CardHeader>
          <CardContent>
           <div className="grid grid-cols-2 gap-4">
                <TextFieldClient id="address" label="Dirección" register={register} error={errors.address} placeholder="Calle del centro" />
                <TextFieldClient  onBlur={async (e) => {
                  const cp = e.target.value
                  if (cp.length === 5) {
                    const result = await searchPostalCode(cp)
                    if (result) {
                      setValue("federalEntity", result.estado)
                      setValue("municipality", result.municipio)
                      setcolonies(result.colonias)
                    }
                  }}} id="postalcode" label="Código postal" register={register} error={errors.postalcode} placeholder="96000" />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <FieldLabel htmlFor={"colonies"}>
                Colonia
                 </FieldLabel>
                <Select  onValueChange={(value) => {
                  setValue("neighborhood", value);   
                }}>
                <SelectTrigger disabled={colonies.length == 0} id="colonies" className="w-[100%] mt-3">
                  <SelectValue placeholder="Selecciona una colonia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>colonias</SelectLabel>
                    {colonies.map((colonie)=>(
                      <SelectItem key={colonie} value={colonie}>{colonie}</SelectItem>
                    ))}
                    
                  </SelectGroup>
                </SelectContent>
              </Select>
                </div>
             
                {/* <TextFieldClient id="neighborhood" label="Colonia" register={register} error={errors.neighborhood} placeholder="Centro" /> */}
                <TextFieldClient disabled id="municipality" label="Municipio" register={register} error={errors.municipality} placeholder="Cristoyucan" />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <TextFieldClient id="locality" label="Localidad" register={register} error={errors.locality} placeholder="Acayucan" />
                <TextFieldClient disabled id="federalEntity" label="Entidad federal" register={register} error={errors.federalEntity} placeholder="Veracruz" />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <TextFieldClient id="interiornumber" label="Número interior" register={register} error={errors.interiornumber} placeholder="2222" />
                <TextFieldClient id="exteriornumber" label="Número exterior" register={register} error={errors.exteriornumber} placeholder="12344" />
              </div>
                
              <TextFieldClient id="betweenstreets" label="Entre calles" register={register} error={errors.betweenstreets} placeholder="calle 1 y 20" className="mt-4" />

              <div className="flex justify-end  gap-3 mt-4 text-red-500">
                <Button type="button" size="lg" variant="secondary"
                  onClick={() => setClientStatus(ClientStatus.ShowAll)}>
                  Cancelar
                </Button>
                <Button type="submit" size="lg">
                  {isLoading?"Guardando...":"Guardar"}
                </Button>
              </div>
         
                            </CardContent>
                           </Card>
                            
                           </form>
       
            </CardContent>
        </>
      
    )
}