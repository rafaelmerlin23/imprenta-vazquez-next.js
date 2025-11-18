import { useAppStore } from "@/app/stores/useAppStore"
import {Field,FieldGroup,FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {FormState} from "@/lib/types"
interface TextFieldClientProps{
    placeholder?:string|undefined,
    value:string|undefined
    id:string
    label?:string
}

export function TextFieldClient({placeholder,value,label,id}:TextFieldClientProps){
    const {client,formClientState} = useAppStore()
    return(
        <Field>
            <FieldLabel htmlFor={id}>
            {label}
            </FieldLabel>
            <Input
            disabled = {formClientState == FormState.Show }
            id={id}
            placeholder={placeholder}
            required
            />
        </Field>
    )
}