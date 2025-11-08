export type UserRole = "admin" | "client"

export type RequestStatus = "solicitada" | "esperando_aceptacion" | "en_proceso" | "terminada"

export type PaymentMethod = "transferencia" | "efectivo"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export interface PrintRequest {
  id: string
  clientId: string
  clientName: string
  description: string
  status: RequestStatus
  estimatedTime?: string
  quotation?: number
  paymentMethod?: PaymentMethod
  isPaidInFull?: boolean
  advance?: number
  paymentProof?: string
  createdAt: string
  updatedAt: string
}

// Mock users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin Principal",
    email: "admin@impresiones.com",
    role: "admin",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Juan Pérez",
    email: "juan@example.com",
    role: "client",
    createdAt: "2024-02-15",
  },
  {
    id: "3",
    name: "María García",
    email: "maria@example.com",
    role: "client",
    createdAt: "2024-03-20",
  },
  {
    id: "4",
    name: "Carlos López",
    email: "carlos@example.com",
    role: "client",
    createdAt: "2024-04-10",
  },
]

// Mock print requests
export const mockRequests: PrintRequest[] = [
  {
    id: "1",
    clientId: "2",
    clientName: "Juan Pérez",
    description: "Impresión de pieza mecánica en PLA, 15cm x 10cm x 5cm",
    status: "solicitada",
    createdAt: "2024-11-05",
    updatedAt: "2024-11-05",
  },
  {
    id: "2",
    clientId: "3",
    clientName: "María García",
    description: "Prototipo de carcasa para dispositivo electrónico en ABS",
    status: "esperando_aceptacion",
    estimatedTime: "48 horas",
    quotation: 1200,
    createdAt: "2024-11-03",
    updatedAt: "2024-11-04",
  },
  {
    id: "3",
    clientId: "4",
    clientName: "Carlos López",
    description: "Set de 10 piezas decorativas en resina",
    status: "en_proceso",
    estimatedTime: "72 horas",
    quotation: 2500,
    paymentMethod: "transferencia",
    isPaidInFull: false,
    advance: 1000,
    createdAt: "2024-11-01",
    updatedAt: "2024-11-02",
  },
  {
    id: "4",
    clientId: "2",
    clientName: "Juan Pérez",
    description: "Modelo arquitectónico a escala en PLA blanco",
    status: "terminada",
    estimatedTime: "24 horas",
    quotation: 800,
    paymentMethod: "efectivo",
    isPaidInFull: true,
    createdAt: "2024-10-28",
    updatedAt: "2024-10-30",
  },
]
