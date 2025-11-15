import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CreateClient(){
     
    return(
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Nuevo Cliente</CardTitle>
              <CardDescription>Coloca los datos de nuevo cliente</CardDescription>
            </div>
       
          </CardHeader>
    )
}