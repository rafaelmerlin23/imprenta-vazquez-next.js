import { z } from "zod"

export const ClientSchema = z.object({
  businessName: z.string().min(3, "Debe tener mínimo 3 caracteres"),
  representativeName: z.string().min(3, "Requerido"),
  phoneNumber: z.string().length(10, "Teléfono inválido"),
  username: z.string().min(3),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Debe tener mínimo 8 caracteres"),
  confirmPassword: z.string().min(8, "Debe tener mínimo 8 caracteres"),
  address: z.string().min(3),
  postalcode: z.string().length(5, "Debe tener 5 dígitos"),
  neighborhood: z.string().nonempty(),
  municipality: z.string().nonempty(),
  locality: z.string().nonempty(),
  federalEntity: z.string().nonempty(),
  interiornumber: z.string().nonempty(),
  exteriornumber: z.string().nonempty(),
  betweenstreets: z.string().nonempty(),

  rfc: z.string().regex(
    /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/,
    "RFC inválido"
  )
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"], 
})


export type ClientFormData = z.infer<typeof ClientSchema>
