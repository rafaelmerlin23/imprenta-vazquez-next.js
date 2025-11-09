"use client"

import type React from "react"

import { mockUsers,User } from "@/lib/mock-data"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UserCog } from "lucide-react"
import Image from 'next/image'

export default function HomePage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user:User|undefined = mockUsers.find(u => u.email == email);
    
    if(user?.role == "admin"){
      router.push("/admin/dashboard");
    }else{
      router.push("/client/dashboard");
    }

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        
        <div className="mx-auto max-w-md mt-8">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex justify-center">
                  <Image src={"logo.png"} alt="logo"  width="240" height="100"/>
              </div>
              <CardTitle className="text-center text-2xl mb-0">Ingresar</CardTitle>
              <CardDescription className="text-center mt-2">
                Ingresa tus credenciales para acceder 
                a la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@impresiones.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    required
                  />
                </div>
                <Button  type="submit" className="w-full bg-amber-400 hover:bg-amber-300 text-black" size="lg">
                  Iniciar Sesión
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
