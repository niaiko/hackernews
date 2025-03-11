"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Icons } from "@/components/icons"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear authentication data
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    // Redirect to login page
    setTimeout(() => {
      router.push("/auth/login")
    }, 1500)
  }, [router])

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Icons.spinner className="h-8 w-8 animate-spin mb-4" />
      <h1 className="text-2xl font-semibold">Logging out...</h1>
      <p className="text-muted-foreground mt-2">You will be redirected shortly.</p>
    </div>
  )
}

