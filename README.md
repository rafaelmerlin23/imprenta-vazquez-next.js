# Imprenta Vázquez - Sistema de Gestión de Impresiones

Sistema web desarrollado con Next.js para la gestión integral de solicitudes de impresión, administración de clientes y seguimiento de trabajos de imprenta.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Guía de Uso](#guía-de-uso)
- [Módulos Principales](#módulos-principales)
- [API y Servicios](#api-y-servicios)
- [Gestión de Estado](#gestión-de-estado)
- [Componentes Reutilizables](#componentes-reutilizables)
- [Desarrollo](#desarrollo)
- [Despliegue](#despliegue)
- [Contribución](#contribución)

## Características

### Panel de Administración
- Gestión completa de clientes registrados
- Seguimiento de solicitudes de impresión por estado
- Creación, edición y visualización de trabajos de impresión
- Panel de métricas con contadores por estado de solicitud
- Gestión de pagos parciales y anticipados

### Panel de Cliente
- Visualización de solicitudes propias
- Creación de nuevas solicitudes de impresión
- Seguimiento del estado de trabajos
- Acceso a historial de pedidos

### Sistema de Autenticación
- Login seguro con roles (Admin/Cliente)
- Gestión de sesiones con tokens
- Protección de rutas por rol de usuario

### Gestión de Solicitudes
- Múltiples tipos de recibo (Impresión, Varios)
- Configuración flexible de papel (tamaño, tipo)
- Selección de colores de copias y tintas
- Carga de archivos para impresión
- Estados de solicitud: Solicitada, Esperando Aceptación, En Proceso, Terminada, Rechazada
- Sistema de pagos con múltiples métodos

## Tecnologías

### Core
- **Next.js 16.0.7** - Framework React con App Router
- **React 19.2.0** - Biblioteca de interfaz de usuario
- **TypeScript 5** - Lenguaje de programación tipado
- **Tailwind CSS 4.1.9** - Framework de CSS utility-first

### UI Components
- **Radix UI** - Componentes accesibles y sin estilos
- **Lucide React** - Iconos modernos
- **Shadcn/ui** - Sistema de componentes
- **Motion** - Animaciones
- **Sonner** - Notificaciones toast

### Formularios y Validación
- **React Hook Form 7.60.0** - Gestión de formularios
- **Zod 3.25.76** - Validación de esquemas
- **@hookform/resolvers** - Integración de validadores

### Estado y Datos
- **Zustand 5.0.8** - Gestión de estado global
- **Axios 1.13.2** - Cliente HTTP
- **date-fns 4.1.0** - Utilidades de fechas

### Otras Herramientas
- **next-themes** - Gestión de temas (modo oscuro)
- **Vercel Analytics** - Analíticas
- **Recharts** - Gráficos y visualización de datos

## Requisitos Previos

- Node.js 18+
- npm, yarn o pnpm
- Acceso al backend API (configurar en variables de entorno)

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/rafaelmerlin23/imprenta-vazquez-next.js.git
cd imprenta-vazquez-next.js
```

2. Instala las dependencias:
```bash
# Con npm
npm install

# Con yarn
yarn install

# Con pnpm (recomendado)
pnpm install
```

3. Configura las variables de entorno (ver sección [Configuración](#configuración))

4. Inicia el servidor de desarrollo:
```bash
npm run dev
# o
pnpm dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# URL del backend API
NEXT_PUBLIC_API_URL=https://tu-api-backend.com/api

# Otras configuraciones opcionales
NEXT_PUBLIC_APP_NAME=Imprenta Vázquez
```

## Estructura del Proyecto

```
imprenta-vazquez-next.js/
├── app/                          # App Router de Next.js
│   ├── admin/
│   │   └── dashboard/            # Panel de administración
│   ├── client/
│   │   └── dashboard/            # Panel de cliente
│   ├── print-jobs/               # Gestión de solicitudes
│   │   ├── create/               # Crear solicitud
│   │   └── [id]/                 # Rutas dinámicas
│   │       ├── edit/             # Editar solicitud
│   │       └── show/             # Ver detalles
│   ├── stores/                   # Stores de Zustand
│   │   └── slices/               # Slices del store
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página de login
│
├── components/                   # Componentes React
│   ├── ui/                       # Componentes base (Shadcn)
│   ├── client-form/              # Formularios de cliente
│   ├── print-jobs/               # Componentes de solicitudes
│   ├── action-buttons.tsx        # Botones de acción
│   ├── basic-info-fields.tsx     # Campos básicos
│   ├── color-selection-section.tsx
│   ├── description-field.tsx
│   ├── error-badge.tsx
│   ├── error-dialog.tsx
│   ├── file-upload-field.tsx
│   ├── form-actions.tsx
│   ├── form-field.tsx
│   ├── form-header.tsx
│   ├── form-section.tsx
│   ├── paper-selection-fields.tsx
│   ├── printing-fields.tsx
│   ├── request-details-dialog.tsx
│   ├── requests-table.tsx
│   ├── status-badge.tsx
│   ├── theme-provider.tsx
│   └── user-info.tsx
│
├── lib/                          # Utilidades y tipos
│   ├── validations/              # Esquemas de validación
│   ├── axios.ts                  # Configuración de Axios
│   ├── helpers.ts                # Funciones auxiliares
│   ├── mock-data.ts              # Datos de prueba
│   ├── types.ts                  # Definiciones de tipos
│   └── utils.ts                  # Utilidades generales
│
├── hooks/                        # Custom hooks
├── public/                       # Archivos estáticos
│   ├── logo.png                  # Logo de la aplicación
│   └── ...                       # Imágenes y recursos
│
├── styles/                       # Estilos globales
├── components.json               # Configuración de Shadcn
├── next.config.mjs               # Configuración de Next.js
├── tailwind.config.ts            # Configuración de Tailwind
├── tsconfig.json                 # Configuración de TypeScript
└── package.json                  # Dependencias del proyecto
```

## Guía de Uso

### Para Administradores

1. **Inicio de Sesión**
   - Accede con credenciales de administrador
   - Serás redirigido al panel de administración

2. **Gestión de Clientes**
   - Navega a la pestaña "Clientes"
   - Visualiza todos los clientes registrados
   - Crea nuevos clientes con el botón "Nuevo Cliente"
   - Edita o visualiza información de clientes existentes
   - Los clientes incluyen: nombre comercial, representante, RFC, teléfono, dirección completa

3. **Gestión de Solicitudes**
   - Visualiza todas las solicitudes en la pestaña "Solicitudes"
   - Filtra por estado haciendo clic en las tarjetas de métricas
   - Estados disponibles: Solicitadas, Esperando Aceptación, En Proceso, Terminadas
   - Cambia el estado de una solicitud desde la tabla
   - Visualiza detalles completos de cada solicitud
   - Gestiona pagos y comprobantes

### Para Clientes

1. **Inicio de Sesión**
   - Accede con tus credenciales
   - Serás redirigido a tu panel de cliente

2. **Crear Nueva Solicitud**
   - Haz clic en "Nueva Solicitud"
   - Completa el formulario con los detalles:
     - Nombre del trabajo
     - Tipo de recibo
     - Tamaño y tipo de papel
     - Cantidad
     - Colores de copias (si aplica)
     - Colores de tinta
     - Archivo a imprimir
     - Descripción adicional
   - Envía la solicitud

3. **Seguimiento de Solicitudes**
   - Visualiza el estado de tus solicitudes
   - Revisa detalles y cotizaciones
   - Sube comprobantes de pago

## Módulos Principales

### Autenticación ([app/page.tsx](app/page.tsx))

Sistema de login con validación de credenciales y redirección según rol:

### Dashboard de Admin ([app/admin/dashboard/page.tsx](app/admin/dashboard/page.tsx))

Panel principal con métricas y gestión completa:

- **Métricas en tiempo real**: Contadores por estado de solicitud
- **Filtrado dinámico**: Clic en tarjetas para filtrar solicitudes
- **Tabs de navegación**: Solicitudes y Clientes
- **CRUD de clientes**: Crear, editar y visualizar
- **Gestión de solicitudes**: Cambio de estado y visualización

### Formulario de Solicitudes ([app/print-jobs/create/page.tsx](app/print-jobs/create/page.tsx))

Formulario modular con validación:

- **Campos básicos**: Nombre, tipo de recibo
- **Configuración de papel**: Tamaño y tipo
- **Cantidades**: Cantidad y número de copias
- **Colores**: Selección de colores de copias y tintas
- **Archivo**: Carga de documento a imprimir
- **Validación**: Esquemas Zod con React Hook Form

## API y Servicios

### Configuración de Axios ([lib/axios.ts](lib/axios.ts))

```typescript
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Endpoints Principales

- **Autenticación**
  - `POST /login` - Iniciar sesión
  - `POST /logout` - Cerrar sesión

- **Clientes**
  - `GET /customers` - Listar clientes
  - `GET /customers/:id` - Obtener cliente
  - `POST /customers` - Crear cliente
  - `PUT /customers/:id` - Actualizar cliente
  - `DELETE /customers/:id` - Eliminar cliente

- **Solicitudes de Impresión**
  - `GET /print-job-requests` - Listar solicitudes
  - `GET /print-job-requests/:id` - Obtener solicitud
  - `POST /print-job-requests` - Crear solicitud
  - `PUT /print-job-requests/:id` - Actualizar solicitud
  - `PATCH /print-job-requests/:id/status` - Cambiar estado
  - `DELETE /print-job-requests/:id` - Eliminar solicitud

- **Pagos**
  - `POST /print-job-requests/:id/payments` - Registrar pago
  - `GET /print-job-requests/:id/payments` - Listar pagos

- **Utilidades**
  - `GET /postal-code/:code` - Obtener dirección por código postal (API de gobierno)

## Gestión de Estado

### Zustand Store ([app/stores/useAppStore.ts](app/stores/useAppStore.ts))

## Componentes Reutilizables

### Componentes de Formulario

- **FormField** ([components/form-field.tsx](components/form-field.tsx)): Campo de formulario con label y error
- **FormSection** ([components/form-section.tsx](components/form-section.tsx)): Sección de formulario con título
- **BasicInfoFields** ([components/basic-info-fields.tsx](components/basic-info-fields.tsx)): Campos básicos de solicitud
- **PaperSelectionFields** ([components/paper-selection-fields.tsx](components/paper-selection-fields.tsx)): Selección de papel
- **ColorSelectionSection** ([components/color-selection-section.tsx](components/color-selection-section.tsx)): Selección de colores
- **FileUploadField** ([components/file-upload-field.tsx](components/file-upload-field.tsx)): Carga de archivos
- **DescriptionField** ([components/description-field.tsx](components/description-field.tsx)): Campo de descripción

### Componentes de UI

- **StatusBadge** ([components/status-badge.tsx](components/status-badge.tsx)): Badge de estado con colores
- **ErrorBadge** ([components/error-badge.tsx](components/error-badge.tsx)): Badge de error
- **ErrorDialog** ([components/error-dialog.tsx](components/error-dialog.tsx)): Diálogo de error
- **RequestDetailsDialog** ([components/request-details-dialog.tsx](components/request-details-dialog.tsx)): Detalles de solicitud
- **RequestsTable** ([components/requests-table.tsx](components/requests-table.tsx)): Tabla de solicitudes
- **ActionButtons** ([components/action-buttons.tsx](components/action-buttons.tsx)): Botones de acción

### Componentes de Cliente

- **ClientsTable** ([components/client-form/clients-table.tsx](components/client-form/clients-table.tsx)): Tabla de clientes
- **FormClient** ([components/client-form/form-client.tsx](components/client-form/form-client.tsx)): Formulario de cliente
- **AddClient** ([components/client-form/add-client.tsx](components/client-form/add-client.tsx)): Crear cliente
- **EditClient** ([components/client-form/edit-client.tsx](components/client-form/edit-client.tsx)): Editar cliente


### Opciones y Enums

```typescript
// Estados de solicitud
const requestStatusOptions: Record<string, string> = {
  "1": "Solicitada",
  "2": "Esperando aceptación",
  "3": "En proceso",
  "4": "Terminada",
  "5": "Rechazada",
}

// Tamaños de papel
const paperSizeOptions: Record<string, string> = {
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

// Métodos de pago
const paymentMethodLabels: Record<PaymentMethod, string> = {
  1: 'Pago parcial por transferencia',
  2: 'Pago anticipado por transferencia',
  3: 'Pago en efectivo (en sucursal)',
}
```

## Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia servidor de desarrollo

# Build
pnpm build        # Construye para producción
pnpm start        # Inicia servidor de producción

# Linting
pnpm lint         # Ejecuta ESLint
```

### Estructura de Componentes

Los componentes siguen el patrón de composición:

1. **Componentes atómicos**: En `components/ui/`
2. **Componentes moleculares**: Combinan componentes atómicos
3. **Componentes orgánicos**: Componentes de página completa

### Convenciones de Código

- **Nombres de archivos**: kebab-case para componentes y archivos
- **Nombres de componentes**: PascalCase
- **Nombres de funciones**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Tipos e interfaces**: PascalCase

### Estructura de Commits

```
tipo(scope): descripción breve

Descripción detallada (opcional)

BREAKING CHANGE: descripción (opcional)
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente en cada push

### Manual

```bash
# Build de producción
pnpm build

# Inicia el servidor
pnpm start
```

### Variables de Entorno para Producción

```env
NEXT_PUBLIC_API_URL=https://api.imprentavazquez.com
NODE_ENV=production
```

## Características Adicionales

### Tema Oscuro
El sistema soporta modo oscuro usando `next-themes`:
```typescript
import { ThemeProvider } from "@/components/theme-provider"
```

### Validación de Formularios
Esquemas de validación con Zod en `lib/validations/`:
```typescript
import { z } from "zod"

const clientSchema = z.object({
  business_name: z.string().min(1, "Requerido"),
  rfc: z.string().length(13, "RFC inválido"),
  // ...
})
```

### Notificaciones
Sistema de toasts con Sonner:
```typescript
import { toast } from "sonner"

toast.success("Operación exitosa")
toast.error("Ocurrió un error")
```

### Integración con API de Gobierno
Obtención automática de direcciones por código postal:
```typescript
// Consulta a API del gobierno mexicano
const response = await axios.get(
  `https://api-sepomex.hckdrk.mx/query/get_cp/${postalCode}`
)
```

## Solución de Problemas

### Error: "Module not found"
```bash
# Reinstala dependencias
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Error: "Cannot connect to API"
- Verifica que la URL del backend esté correcta en `.env.local`
- Asegúrate de que el backend esté corriendo
- Revisa CORS en el backend

### Error: "Build failed"
```bash
# Limpia el cache de Next.js
rm -rf .next
pnpm build
```

## Roadmap

- [ ] Implementar sistema de notificaciones en tiempo real
- [ ] Agregar exportación de reportes en PDF
- [ ] Implementar dashboard con gráficos y estadísticas
- [ ] Agregar sistema de mensajería entre admin y cliente
- [ ] Implementar historial de cambios en solicitudes
- [ ] Agregar soporte para múltiples archivos por solicitud
- [ ] Implementar sistema de plantillas de impresión

## Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto es privado y pertenece a Imprenta Vázquez.

## Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

**Desarrollado con dedicación para Imprenta Vázquez**
