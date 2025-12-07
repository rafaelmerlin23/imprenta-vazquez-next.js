export type UserRole = "admin" | "client"

export type RequestStatus = {
  "0": "Sin procesar",
  "1": "Solicitada",
  "2": "Esperando aceptación",
  "3": "En proceso",
  "4": "Terminada",
}

export type PaperSize = {
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

export type PaperType = {
  "0": "Seleccione una opción",
  "1": 'Papel bond',
  "2": 'Papel autocopiante',
  "3": 'Cartulina',
}

export type PaymentMethod = "transferencia" | "efectivo"

export interface Address {
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
}

export interface Customer {
  id: string
  address_id: string
  business_name: string
  representative_name: string
  rfc: string
  phone_number: string
  address?: Address
}

export interface PrintRequest {
  id: string
  customer_id: string
  name: string
  type_receipt_id: string
  paper_size: keyof PaperSize
  paper_type: keyof PaperType
  quantity: number
  copies_number?: string
  folio?: string
  copies_colors?: number[]
  tint_colors: number[]
  file_path: { name: string } | File
  description: string
  status: keyof RequestStatus
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

interface hola{
  status:string
}
export const mockRequests:PrintRequest[]|any = [] 

export const mockUsers:hola[] = [] 