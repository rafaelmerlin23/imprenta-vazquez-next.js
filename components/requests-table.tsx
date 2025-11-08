"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/status-badge"
import { Eye } from "lucide-react"
import type { PrintRequest } from "@/lib/mock-data"
import { RequestDetailsDialog } from "./request-details-dialog"

interface RequestsTableProps {
  requests: PrintRequest[]
  isAdmin: boolean
}

export function RequestsTable({ requests, isAdmin }: RequestsTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<PrintRequest | null>(null)

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              {isAdmin && <TableHead>Cliente</TableHead>}
              <TableHead>Descripción</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} className="text-center text-muted-foreground">
                  No hay solicitudes
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono text-sm">#{request.id}</TableCell>
                  {isAdmin && <TableCell className="font-medium">{request.clientName}</TableCell>}
                  <TableCell className="max-w-md truncate">{request.description}</TableCell>
                  <TableCell>
                    <StatusBadge status={request.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString("es-MX")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(request)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <RequestDetailsDialog
        request={selectedRequest}
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
        isAdmin={isAdmin}
      />
    </>
  )
}
