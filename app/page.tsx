"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { useAppStore } from "./stores/useAppStore"
import { ErrorDialog } from "@/components/error-dialog"

export default function HomePage() {
  const router = useRouter()
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  
  const {
    currentLoginInfoUser,
    isLogged,
    user,
    password,
    error,
    isLoading,
    setUser,
    setPassword,
    setError,
    login
  } = useAppStore()

  useEffect(() => {
    if (isLogged) {
      currentLoginInfoUser?.is_admin 
        ? router.push("/admin/dashboard") 
        : router.push("/client/dashboard")
    }
  }, [isLogged, currentLoginInfoUser, router])

  // Mostrar modal cuando hay un error
  useEffect(() => {
    if (error) {
      setShowErrorDialog(true)
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try{
      await login(router)
    }catch(e){
      setError("error we")
    }

  }

  const handleCloseErrorDialog = () => {
    setShowErrorDialog(false)
    setError(null)
  }
  
  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-md mt-8">
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex justify-center">
                  <Image src={"logo.png"} alt="logo" width="240" height="100"/>
                </div>
                <CardTitle className="text-center text-2xl mb-0">Ingresar</CardTitle>
                <CardDescription className="text-center mt-2">
                  Ingresa tus credenciales para acceder a la aplicación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Nombre de usuario</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="admin@impresiones.com"
                      value={user}
                      onChange={(e) => setUser(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-amber-400 hover:bg-amber-300 text-black" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={handleCloseErrorDialog}
        title="Error al iniciar sesión"
        description={error || "Ha ocurrido un error inesperado"}
      />
    </>
  )
}