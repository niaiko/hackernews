"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Si le chargement est terminé et que l'authentification est requise mais l'utilisateur n'est pas authentifié
    if (!isLoading && requireAuth && !isAuthenticated) {
      // Stocker la page actuelle pour rediriger après la connexion
      localStorage.setItem("redirectAfterLogin", pathname)
      router.push("/auth/login")
    }

    // Si l'utilisateur est authentifié et qu'il essaie d'accéder à une page d'authentification
    if (!isLoading && isAuthenticated && (pathname === "/auth/login" || pathname === "/auth/register")) {
      router.push("/stories")
    }
  }, [isLoading, isAuthenticated, requireAuth, router, pathname])

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Chargement...</p>
        </div>
      </div>
    )
  }

  // Si l'authentification est requise et que l'utilisateur n'est pas authentifié, ne rien afficher
  // (la redirection sera gérée par l'effet ci-dessus)
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // Sinon, afficher les enfants
  return <>{children}</>
}

