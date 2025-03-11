"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    } else {
      setIsAuthenticated(false)
      setUser(null)
    }

    setLoading(false)
  }, [])

  const login = (token: string, userData: any) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
    setUser(null)
    router.push("/auth/login")
  }

  const requireAuth = (callback: () => void) => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login")
    } else if (!loading && isAuthenticated) {
      callback()
    }
  }

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    requireAuth,
  }
}

