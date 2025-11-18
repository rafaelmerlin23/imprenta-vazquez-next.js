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
  id: number
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
  id: number
  username: string
  email: string
  isAdmin: number
  email_verified_at: any
  created_at: string
  updated_at: string
  deleted_at: any
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