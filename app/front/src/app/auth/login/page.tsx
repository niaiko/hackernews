"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
// Importez le fichier de configuration
import { config } from "@/config"

const loginSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)

    try {
      // Remplacez l'URL codée en dur par la configuration
      const response = await fetch(`${config.apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const userData = await response.json()

      // Utiliser la fonction login du contexte d'authentification
      login(userData.token, userData.user)

      // Rediriger vers la page précédente ou la page d'accueil
      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/stories"
      localStorage.removeItem("redirectAfterLogin")
      router.push(redirectPath)
    } catch (error) {
      console.error("Login error:", error)
      toast({
        variant: "destructive",
        title: "Échec de la connexion",
        description: "Veuillez vérifier vos identifiants et réessayer.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-[calc(100vh-4rem)] w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <Icons.logo className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Bienvenue</h1>
          <p className="text-sm text-muted-foreground">Entrez vos identifiants pour vous connecter</p>
        </div>
        <div className="grid gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Connexion</CardTitle>
              <CardDescription>Entrez vos identifiants pour accéder à votre compte</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="votre.email@exemple.com"
                            type="email"
                            autoComplete="email"
                            className="transition-all focus:border-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            autoComplete="current-password"
                            className="transition-all focus:border-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full transition-all hover:shadow-lg" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Connexion en cours...
                      </>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                <Link
                  href="/auth/register"
                  className="underline underline-offset-4 hover:text-primary transition-colors"
                >
                  Vous n'avez pas de compte ? Inscrivez-vous
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
