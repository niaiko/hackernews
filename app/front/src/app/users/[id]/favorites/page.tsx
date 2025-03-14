"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Separator } from "@/components/ui/separator"

// Importez le fichier de configuration
import { config } from "@/config"

type User = {
  id: number
  username: string
  age: number
  description: string
  profileImageUrl: string | null
}

type Favorite = {
  id: number
  storyId: number
  title: string
  url: string
  by: string
  score: number
  time: number
}

export default function UserFavoritesPage() {
  const params = useParams()
  const userId = params.id as string
  const router = useRouter()
  const { toast } = useToast()

  const [user, setUser] = useState<User | null>(null)
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      setIsLoading(true)
      try {
        // Fetch user info
        const userResponse = await fetch(`${config.apiUrl}/api/users/${userId}`)

        if (!userResponse.ok) {
          if (userResponse.status === 404) {
            toast({
              variant: "destructive",
              title: "User not found",
              description: "This user doesn't exist or their profile is private.",
            })
            router.push("/users")
            return
          }
          throw new Error("Failed to fetch user")
        }

        const userData = await userResponse.json()
        setUser(userData.user)

        // Fetch user's favorites
        const favoritesResponse = await fetch(`${config.apiUrl}/api/users/${userId}/favorites`)

        if (!favoritesResponse.ok) {
          throw new Error("Failed to fetch user favorites")
        }

        const favoritesData = await favoritesResponse.json()
        setFavorites(favoritesData.favorites)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user data. Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAndFavorites()
  }, [userId, router, toast])

  const formatTime = (timestamp: number) => {
    const now = new Date()
    const storyTime = new Date(timestamp * 1000)
    const diffInMinutes = Math.floor((now.getTime() - storyTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`
    } else {
      const days = Math.floor(diffInMinutes / (60 * 24))
      return `${days} day${days !== 1 ? "s" : ""} ago`
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4" />

          <Card>
            <CardHeader className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>

          <Skeleton className="h-6 w-1/5" />

          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="p-4">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-2/5 mt-2" />
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-8 w-32" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Icons.users className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold">User Not Found</h1>
          <p className="text-muted-foreground mb-4">This user doesn't exist or their profile is private.</p>
          <Button asChild>
            <Link href="/users">Back to Users</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{user.username}'s Profile</h1>
          <p className="text-muted-foreground">View {user.username}'s favorite stories</p>
        </div>

        <Card>
          <CardHeader className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.profileImageUrl || "/placeholder.svg"} alt={user.username} />
                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{user.username}</CardTitle>
                <CardDescription>Age: {user.age}</CardDescription>
              </div>
            </div>
          </CardHeader>
          {user.description && (
            <CardContent className="p-4 pt-0">
              <p className="text-sm">{user.description}</p>
            </CardContent>
          )}
        </Card>

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">Favorite Stories</h2>

          {favorites.length > 0 ? (
            <div className="grid gap-4">
              {favorites.map((favorite) => (
                <Card key={favorite.id} className="transition-all duration-200 hover:shadow-md">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg leading-tight">
                      <Link
                        href={favorite.url || `https://news.ycombinator.com/item?id=${favorite.storyId}`}
                        target="_blank"
                        className="hover:underline flex items-start"
                      >
                        {favorite.title}
                        {favorite.url && <Icons.externalLink className="ml-1 h-3 w-3 flex-shrink-0 mt-1.5" />}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center text-xs gap-2">
                      <span className="font-medium">{favorite.score} points</span>
                      <span>by {favorite.by}</span>
                      <span>{formatTime(favorite.time)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" size="sm" asChild className="text-xs h-8">
                      <Link href={`https://news.ycombinator.com/item?id=${favorite.storyId}`} target="_blank">
                        <Icons.messageCircle className="h-3 w-3 mr-1" />
                        View comments
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Icons.heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No favorites yet</h3>
              <p className="text-muted-foreground">This user hasn't saved any stories to their favorites yet.</p>
            </div>
          )}
        </div>

        <Separator />

        <div className="text-center">
          <Button asChild variant="outline">
            <Link href="/users">
              <Icons.chevronRight className="mr-2 h-4 w-4 rotate-180" />
              Back to All Users
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
