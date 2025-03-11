"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

const profileSchema = z
  .object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    age: z.number().min(13, { message: "You must be at least 13 years old" }),
    description: z.string().max(500, { message: "Description must be less than 500 characters" }),
    profileVisibility: z.boolean(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // If one password field is filled, both must be filled and must match
      if (data.password || data.confirmPassword) {
        if (!data.password || !data.confirmPassword) return false
        if (data.password !== data.confirmPassword) return false
        if (data.password.length < 8) return false
      }
      return true
    },
    {
      message: "Passwords must match and be at least 8 characters",
      path: ["confirmPassword"],
    },
  )

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      age: 18,
      description: "",
      profileVisibility: true,
      password: "",
      confirmPassword: "",
    },
  })

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to view your profile.",
        })
        router.push("/auth/login")
        return
      }

      setIsAuthenticated(true)

      const response = await fetch("http://localhost:4001/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user profile")
      }

      const userData = await response.json()

      form.reset({
        username: userData.username,
        email: userData.email,
        age: userData.age || 18,
        description: userData.description || "",
        profileVisibility: userData.profileVisibility,
        password: "",
        confirmPassword: "",
      })

      if (userData.profileImageUrl) {
        setImagePreview(userData.profileImageUrl)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your profile. Please try again.",
      })
    }
  }, [form, router, toast])

  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImage(file)

      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        router.push("/auth/login")
        return
      }

      const formData = new FormData()
      formData.append("username", data.username)
      formData.append("email", data.email)
      formData.append("age", data.age.toString())
      formData.append("description", data.description)
      formData.append("profileVisibility", data.profileVisibility.toString())

      if (data.password) {
        formData.append("password", data.password)
      }

      if (profileImage) {
        formData.append("profileImage", profileImage)
      }

      const response = await fetch("http://localhost:4001/api/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      // Reset the password fields
      form.setValue("password", "")
      form.setValue("confirmPassword", "")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update your profile. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and profile information.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your profile details and visibility settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={imagePreview || "/placeholder.svg"} alt="Profile" />
                      <AvatarFallback>
                        <Icons.user className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="mt-2">
                      <label htmlFor="profile-image" className="cursor-pointer">
                        <div className="inline-flex items-center rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm transition-colors hover:bg-accent text-center">
                          Change
                        </div>
                        <input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-4 flex-1">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input type="email" {...field} />
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
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us a bit about yourself" className="min-h-32" {...field} />
                      </FormControl>
                      <FormDescription>This will be displayed on your public profile if it's visible.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Leave blank to keep unchanged" {...field} />
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
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="profileVisibility"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Profile Visibility</FormLabel>
                        <FormDescription>Allow other users to view your profile and favorites</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

