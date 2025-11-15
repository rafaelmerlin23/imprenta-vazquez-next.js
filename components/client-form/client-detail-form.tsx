import { useAppStore } from "@/app/stores/useAppStore"
import {Field,FieldGroup,FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {FormState} from "@/lib/types"
import {TextFieldClient} from "./text-field-client"
export function ClientDetailForm (){
    const {client} = useAppStore()
    
    
    return(
        <div>
            <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                
                <TextFieldClient
                    id="address"
                    label="Dirección"
                    value="" 
                    placeholder={client?.customer_address.address}
                />
                <TextFieldClient
                    id="postalcode"
                    label="Código postal"
                    value="" 
                    placeholder={client?.customer_address.postal_code}
                />

                </div>
                <div className="grid grid-cols-2 gap-4">
                
                <TextFieldClient
                    id="neighborhood"
                    label="Colonia"
                    value="" 
                    placeholder={client?.customer_address.neighborhood}
                />
                
                <TextFieldClient
                    id="municipality"
                    label="Municipio"
                    value="" 
                    placeholder={client?.customer_address.municipality}
                />
                
                </div>
                    <div className="grid grid-cols-2 gap-4">
                
                <TextFieldClient
                    id="locality"
                    label="Localidad"
                    value="" 
                    placeholder={client?.customer_address.locality_name}
                />
                
                <TextFieldClient
                    id="federalEntity"
                    label="Entidad federal"
                    value="" 
                    placeholder={client?.customer_address.federal_entity}
                />
                
                </div>
                    <div className="grid grid-cols-2 gap-4">
                <TextFieldClient
                    id="interiornumber"
                    label="Número interior"
                    value="" 
                    placeholder={client?.customer_address.interior_number}
                />
                
                <TextFieldClient
                    id="exteriornumber"
                    label="Número exterior"
                    value="" 
                    placeholder={client?.customer_address.exterior_number}
                />
                
                </div>
                <TextFieldClient
                    id="beweenstreets"
                    label="Entre calles"
                    value="" 
                    placeholder={client?.customer_address.between_streets}
                />
                
            </FieldGroup>
        </div>
    )
}