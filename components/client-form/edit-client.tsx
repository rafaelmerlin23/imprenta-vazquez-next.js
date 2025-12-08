"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {FieldGroup} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/app/stores/useAppStore"
import { ClientStatus } from "@/lib/types"
import { TextFieldClient } from "./text-field-client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ClientSchema, ClientFormData } from "@/lib/validations/clientSchema"
import { useState, useEffect } from "react"
import axios from "@/lib/axios"
import { toast } from "sonner"

export function EditClient() {
  const { setClientStatus, client, updateClient, clientIdSelected, getClient } = useAppStore()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(ClientSchema),
  })

  useEffect(() => {
    if (client) {
      reset({
        businessName: client.business_name || "",
        representativeName: client.representative_name || "",
        phoneNumber: client.phone_number || "",
        email: client.user.email || "",
        username: client.user.name || "",
        rfc: client.rfc || "",
        address: client.customer_address.address || "",
        postalcode: client.customer_address.postal_code || "",
        neighborhood: client.customer_address.neighborhood || "",
        municipality: client.customer_address.municipality || "",
        locality: client.customer_address.locality_name || "",
        federalEntity: client.customer_address.federal_entity || "",
        interiornumber: client.customer_address.interior_number || "",
        exteriornumber: client.customer_address.exterior_number || "",
        betweenstreets: client.customer_address.between_streets || "",
        password: "",
        confirmPassword: "",
      })
    }
  }, [client, reset])

  useEffect(() => {
    if (clientIdSelected) {
        getClient();
    }
  }, [clientIdSelected]);


  const onSubmit = async (data: ClientFormData) => {
    setIsLoading(true)

    const updatedClient = {
      username: data.username,
      email: data.email,
      postal_code: data.postalcode,
      address: data.address,
      locality_name: data.locality,
      federal_entity: data.federalEntity,
      neighborhood: data.neighborhood,
      municipality: data.municipality,
      between_streets: data.betweenstreets,
      interior_number: data.interiornumber,
      exterior_number: data.exteriornumber,
      business_name: data.businessName,
      representative_name: data.representativeName,
      rfc: data.rfc,
      phone_number: data.phoneNumber,

      ...(data.password && {
        password: data.password,
        password_confirmation: data.confirmPassword,
      }),
    }

    try {
      await updateClient(clientIdSelected, updatedClient)

      await getClient().catch((err) => {
        console.error("Error al refrescar cliente después de actualizar", err)
      })
      
      toast.success("Cliente actualizado", {
        description: "Los datos del cliente se han actualizado con éxito",
        action: {
          label: "Ok",
          onClick: () => window.location.reload(),
        },
      })

      await getClient()
      
      setClientStatus(ClientStatus.Show)
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al actualizar cliente"

      toast.error("Error", {
        description: message,
        action: {
          label: "Ok",
          onClick: () => console.log("Ok"),
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Editar cliente</CardTitle>
          <CardDescription>Actualice los datos del cliente {client?.business_name}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Información del cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex w-full flex-col">
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
                  <TextFieldClient
                    id="representativeName"
                    label="Representante legal"
                    register={register}
                    error={errors.representativeName}
                    placeholder="Juan Pérez"
                  />
                  <TextFieldClient
                    id="phoneNumber"
                    label="Número de Teléfono"
                    register={register}
                    error={errors.phoneNumber}
                    placeholder="924139543"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <TextFieldClient
                    className="mt-4"
                    id="email"
                    label="Correo electrónico"
                    register={register}
                    error={errors.email}
                    type="email"
                    placeholder="henryfrans@gmail.com"
                  />
                  <TextFieldClient
                    className="mt-4"
                    id="username"
                    label="Nombre de usuario"
                    register={register}
                    error={errors.username}
                    placeholder="henryfv"
                  />
                </div>

                <TextFieldClient
                  className="mt-4"
                  id="rfc"
                  label="RFC"
                  register={register}
                  error={errors.rfc}
                  placeholder="MEPR0303212M0"
                />
                
                <div className="mt-4 mb-2">
                  <p className="text-sm text-muted-foreground">
                    Deje los campos de contraseña vacíos si no desea cambiarla
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <TextFieldClient
                    type="password"
                    id="password"
                    label="Nueva contraseña (opcional)"
                    register={register}
                    error={errors.password}
                    placeholder="*******"
                  />
                  <TextFieldClient
                    type="password"
                    id="confirmPassword"
                    label="Confirmar contraseña"
                    register={register}
                    error={errors.confirmPassword}
                    placeholder="*******"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-0">
            <CardHeader>
              <CardTitle>Información de dirección</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <TextFieldClient
                  id="address"
                  label="Dirección"
                  register={register}
                  error={errors.address}
                  placeholder="Calle del centro"
                />
                <TextFieldClient
                  id="postalcode"
                  label="Código postal"
                  register={register}
                  error={errors.postalcode}
                  placeholder="96000"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <TextFieldClient
                  id="neighborhood"
                  label="Colonia"
                  register={register}
                  error={errors.neighborhood}
                  placeholder="Centro"
                />
                <TextFieldClient
                  id="municipality"
                  label="Municipio"
                  register={register}
                  error={errors.municipality}
                  placeholder="Cristoyucan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <TextFieldClient
                  id="locality"
                  label="Localidad"
                  register={register}
                  error={errors.locality}
                  placeholder="Acayucan"
                />
                <TextFieldClient
                  id="federalEntity"
                  label="Entidad federal"
                  register={register}
                  error={errors.federalEntity}
                  placeholder="Veracruz"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <TextFieldClient
                  id="interiornumber"
                  label="Número interior"
                  register={register}
                  error={errors.interiornumber}
                  placeholder="2222"
                />
                <TextFieldClient
                  id="exteriornumber"
                  label="Número exterior"
                  register={register}
                  error={errors.exteriornumber}
                  placeholder="12344"
                />
              </div>

              <TextFieldClient
                id="betweenstreets"
                label="Entre calles"
                register={register}
                error={errors.betweenstreets}
                placeholder="calle 1 y 20"
                className="mt-4"
              />

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={() => setClientStatus(ClientStatus.Show)}
                >
                  Cancelar
                </Button>
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? "Actualizando..." : "Actualizar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </CardContent>
    </>
  )
}