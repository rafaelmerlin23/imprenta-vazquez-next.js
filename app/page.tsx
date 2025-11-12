"use client"

import type React from "react"

import { mockUsers,User } from "@/lib/mock-data"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import axios from '@/lib/axios'


export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("henryyv");
  const [password, setPassword] = useState("password");

  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push("/admin/dashboard");
    }
  },[])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const user:User|undefined = mockUsers.find(u => u.name == username);
    await login()  


  }
  
  const login = async () => {
  try {
    await axios.get('/sanctum/csrf-cookie');
    
    const response = await axios.post('/api/login', {
      username,
      password
    });
    if(response.data){
      
      localStorage.setItem("token",response?.data?.token.toString());
      if(response?.data?.user?.isAdmin == 1){
        router.push("/admin/dashboard");
      }else{
        router.push("/client/dashboard");
      }
    }
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
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
                  <Label htmlFor="username">Correo electrónico</Label>
                  <Input
                    id="text"
                    type="text"
                    placeholder="admin@impresiones.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
