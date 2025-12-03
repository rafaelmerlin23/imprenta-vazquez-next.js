export type UserRole = "admin" | "client"

export type PaymentMethod = "transferencia" | "efectivo"

export interface Client {
  id: number
  business_name: string
  representative_name: string
  rfc: string
  phone_number: string
  created_at: string
  updated_at: string
}


export interface ResponseClient {
  data: ClientData
}

export interface ClientData {
  id: number
  business_name: string
  representative_name: string
  rfc: string
  phone_number: string
  created_at: string
  updated_at: string
  customer_address: CustomerAddress
  user: User
}

export interface CustomerAddress {
  id: string
  postal_code: string
  address: string
  locality_name: string
  federal_entity: string
  neighborhood: string
  municipality: string
  between_streets: string
  interior_number: string
  exterior_number: string
  created_at: string
  updated_at: string
  deleted_at: any
}

export interface User {
  id: string
  is_admin: boolean
  name: string
  email: string
  role: UserRole
  email_verified_at: any
  created_at: string
  updated_at: string
  deleted_at: any
  customer: Customer | null
}

export enum ClientStatus {
  ShowAll,
  Show,
}

export enum FormState{
  Create,
  Edit,
  Show,
}

export interface Customer {
  id: string
  address_id: string
  business_name: string
  representative_name: string
  rfc: string
  phone_number: string
  address?: CustomerAddress
}

export interface PrintRequest {
  id: string
  customer_id: string
  name: string
  type_receipt_id: keyof typeof typeReceiptOptions
  paper_size: keyof typeof paperSizeOptions
  paper_type: keyof typeof paperTypeOptions
  quantity: number
  copies_number?: string
  folio?: string
  copies_colors?: number[]
  tint_colors: number[]
  file_path: { name: string } | File
  description: string
  status: keyof typeof requestStatusOptions
  estimated_time?: string
  quotation?: number
  payment_method?: PaymentMethod
  is_paid_in_full?: boolean
  advance?: number
  payment_proof?: string
  created_at: string
  updated_at: string
  customer?: Customer
}

export type PrintJobRequest = {
  id: string
  customer_id: string
  name: string
  type_receipt_id: keyof typeof typeReceiptOptions
  paper_size: keyof typeof paperSizeOptions
  paper_type: keyof typeof paperTypeOptions
  quantity: number
  copies_number?: string
  folio?: string
  copies_colors?: number[]
  tint_colors: number[]
  file_path: File
  description: string
  status: keyof typeof requestStatusOptions
  estimated_time?: string
  quotation?: number
  payment_method?: PaymentMethod
  is_paid_in_full?: boolean
  advance?: number
  payment_proof?: string
  created_at: string
  updated_at: string
  customer?: Customer
};

export type RequestStatus = {
  "1": "Solicitada",
  "2": "Esperando aceptación",
  "3": "En proceso",
  "4": "Terminada",
  "5": "Rechazada",
}

export const requestStatusOptions: Record<string, string> = {
  "0": "Seleccione una opción",
  "1": "Solicitada",
  "2": "Esperando aceptación",
  "3": "En proceso",
  "4": "Terminada",
  "5": "Rechazada",
}

export const paperSizeOptions: Record<string, string> = {
  "0": "Seleccione una opción",
  "1": '1/8 de carta',
  "2": '1/6 de carta',
  "3": '1/4 de carta',
  "4": '1/4 de oficio',
  "5": '1/2 de carta',
  "6": '1/2 de oficio',
  "7": 'Tamaño carta',
  "8": 'Tamaño oficio',
  "9": 'Tamaño especial',
}

export const paperTypeOptions: Record<string, string> = {
  "0": "Seleccione una opción",
  "1": 'Papel bond',
  "2": 'Papel autocopiante',
  "3": 'Cartulina',
}

export const typeReceiptOptions: Record<string, string> = {
  "0": "Seleccione una opción",
  "1": "Impresión",
  "2": "Varios",
}

export const copiesColors = {
  1: "Rosa",
  2: "Azul",
  3: "Amarillo",
  4: "Verde",
};

export const tintColors = {
  1: "Negro",
  2: "Azul reflex",
  3: "Azul process",
  4: "Verde",
  5: "Rojo",
  6: "Sepia",
  7: "Otro",
};