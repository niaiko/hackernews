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
import { config } from "@/config"

const registerSchema = z
  .object({
    username: z.string().min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères" }),
    email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
    age: z.string().refine(
      (val) => {
        const age = Number.parseInt(val)
        return !isNaN(age) && age > 0 && age < 120
      },
      { message: "Veuillez entrer un âge valide" },
    ),
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      age: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)

    try {
      // Remplacez l'URL codée en dur par la configuration
      // Dans la fonction onSubmit, remplacez la ligne contenant l'URL directe:
      const response = await fetch(`${config.apiUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          age: Number.parseInt(data.age),
          password: data.password,
          profileVisibility: true, // Default to visible
          description: "", // Default empty description
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Registration failed")
      }

      const userData = await response.json()

      // Utiliser la fonction login du contexte d'authentification
      login(userData.token, userData.user)

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      })

      // Rediriger vers la page d'accueil
      router.push("/stories")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        variant: "destructive",
        title: "Échec de l'inscription",
        description: error instanceof Error ? error.message : "Veuillez vérifier vos informations et réessayer.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-full min-h-[calc(100vh-4rem)] w-screen flex-col items-center justify-center py-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <Icons.logo className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Créer un compte</h1>
          <p className="text-sm text-muted-foreground">Entrez vos informations pour créer un compte</p>
        </div>
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Inscription</CardTitle>
            <CardDescription>Créez un nouveau compte pour commencer</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom d'utilisateur</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" className="transition-all focus:border-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Âge</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="30"
                          type="number"
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
                          autoComplete="new-password"
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer le mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          autoComplete="new-password"
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
                      Inscription en cours...
                    </>
                  ) : (
                    "S'inscrire"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary transition-colors">
                Vous avez déjà un compte ? Connectez-vous
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
