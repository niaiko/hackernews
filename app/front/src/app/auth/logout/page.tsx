"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Icons } from "@/components/icons"
import { useAuth } from "@/contexts/auth-context"

export default function LogoutPage() {
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    // Déconnecter l'utilisateur
    logout()

    // Rediriger vers la page de connexion après un court délai
    const timer = setTimeout(() => {
      router.push("/auth/login")
    }, 1500)

    return () => clearTimeout(timer)
  }, [logout, router])

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Icons.spinner className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-semibold">Déconnexion en cours...</h1>
      <p className="text-muted-foreground mt-2">Vous allez être redirigé dans un instant.</p>
    </div>
  )
}

