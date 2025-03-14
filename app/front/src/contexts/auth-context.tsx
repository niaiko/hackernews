"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
// Importez le fichier de configuration
import { config } from "@/config"

type User = {
  id: number
  username: string
  email: string
  age: number
  description: string
  profileImageUrl: string | null
  profileVisibility: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: User) => void
  checkAuthStatus: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus()
      setIsLoading(false)
    }

    initAuth()
  }, [])

  // Vérifier si le token est valide
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      // Mettez également à jour l'utilisation de localStorage pour utiliser les clés centralisées:
      const storedToken = localStorage.getItem(config.tokenKey)
      const storedUser = localStorage.getItem(config.userKey)

      if (!storedToken || !storedUser) {
        return false
      }

      // Vérifier si le token est valide en faisant une requête au serveur
      // Remplacez l'URL codée en dur pour vérifier l'état d'authentification:
      const response = await fetch(`${config.apiUrl}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })

      if (!response.ok) {
        // Si le token n'est pas valide, déconnecter l'utilisateur
        clearAuthData()
        return false
      }

      // Si le token est valide, mettre à jour l'état
      const userData = await response.json()
      setUser(userData)
      setToken(storedToken)
      return true
    } catch (error) {
      console.error("Error checking auth status:", error)
      clearAuthData()
      return false
    }
  }

  // Connexion
  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)

    // Stocker les données d'authentification dans localStorage
    // Et plus bas dans la fonction login():
    localStorage.setItem(config.tokenKey, newToken)
    localStorage.setItem(config.userKey, JSON.stringify(newUser))

    toast({
      title: "Connexion réussie",
      description: `Bienvenue, ${newUser.username}!`,
      duration: 3000,
    })
  }

  // Déconnexion
  const logout = () => {
    clearAuthData()

    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
      duration: 3000,
    })

    router.push("/auth/login")
  }

  // Mettre à jour les informations de l'utilisateur
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  // Effacer les données d'authentification
  const clearAuthData = () => {
    setToken(null)
    setUser(null)
    // Et dans la fonction logout():
    localStorage.removeItem(config.tokenKey)
    localStorage.removeItem(config.userKey)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        updateUser,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
