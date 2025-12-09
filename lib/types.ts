export type UserRole = "admin" | "client"

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

export interface UserApi {
  id: string
  is_admin: boolean
  username: string
  email: string
  role: UserRole
  email_verified_at: any
  created_at: string
  updated_at: string
  deleted_at: any
  customer: Customer | null
}


export function mapUser(api: UserApi): User {
  return {
    id: api.id,
    is_admin: api.is_admin,
    username: api.username,
    email: api.email,
    role: api.role,
    emailVerifiedAt: api.email_verified_at,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    deletedAt: api.deleted_at,
    customer: api.customer,
  }
}

export interface User {
  id: string
  is_admin: boolean
  username: string
  email: string
  role: UserRole
  emailVerifiedAt: any
  createdAt: string
  updatedAt: string
  deletedAt: any
  customer: Customer | null
}

export enum ClientStatus {
  ShowAll,
  Show,
  Create,
  Edit,
  
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
  estimated_date?: string
  price?: number
  payment_method?: PaymentMethod
  is_paid?: boolean
  created_at: string
  updated_at: string
  customer?: Customer
  payments?: PrintJobPayment[];
};

export type RequestStatus = 
  | 'pending'
  | 'waiting_acceptance'
  | 'declined'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'rejected';

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
  "2": "Impresión",
  "3": "Varios",
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

export const requestStatusLabels: Record<RequestStatus, string> = {
  pending: 'Pendiente',
  waiting_acceptance: 'Esperando aceptación',
  accepted: 'Aceptada',
  in_progress: 'En proceso',
  completed: 'Completada',
  rejected: 'Rechazada',
  declined: 'Denegada',
};


// Interface para pagos
export interface PrintJobPayment {
  id: string;
  print_job_request_id: string;
  payment_method: PaymentMethod;
  amount: number;
  paid_at: string;
  file_path?: string;
  created_at: string;
  updated_at: string;
}

export type PaymentMethod = 1 | 2 | 3;

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  1: 'Pago parcial por transferencia',
  2: 'Pago anticipado por transferencia',
  3: 'Pago en efectivo (en sucursal)',
};
