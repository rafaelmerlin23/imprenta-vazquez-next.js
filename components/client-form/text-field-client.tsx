import { useAppStore } from "@/app/stores/useAppStore"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FieldError, UseFormRegister } from "react-hook-form"

interface TextFieldClientProps {
  id: string
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: FieldError
  register?: UseFormRegister<any>
  className?: string
  type?: HTMLInputElement["type"]
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

export function TextFieldClient({
  id,
  label,
  placeholder,
  error,
  register,
  disabled = false,
  className,
  type,
  onBlur,
}: TextFieldClientProps) {
  const { formClientState } = useAppStore()

  const registerProps = register?.(id)

  return (
    <Field className={`space-y-1 ${className}`}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...registerProps}
        onBlur={(e) => {
          registerProps?.onBlur?.(e) 
          onBlur?.(e)                
        }}
      />

      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </Field>
  )
}
