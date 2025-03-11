"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

type Favorite = {
  id: number
  storyId: number
  title: string
  url: string
  by: string
  score: number
  time: number
}

export default function FavoritesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          toast({
            variant: "destructive",
            title: "Authentication required",
            description: "Please log in to view your favorites.",
          })
          router.push("/auth/login")
          return
        }

        const response = await fetch("http://localhost:4001/api/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch favorites")
        }

        const data = await response.json()
        setFavorites(data.favorites)
      } catch (error) {
        console.error("Error fetching favorites:", error)
        toast({
          variant: "destructive",
          title: "Error fetching favorites",
          description: "Failed to load your favorite stories.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [router, toast])

  const removeFavorite = async (storyId: number) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        router.push("/auth/login")
        return
      }

      const response = await fetch(`http://localhost:4001/api/favorites/${storyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to remove favorite")
      }

      setFavorites(favorites.filter((fav) => fav.storyId !== storyId))

      toast({
        title: "Success",
        description: "Story removed from favorites",
      })
    } catch (error) {
      console.error("Error removing favorite:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove story from favorites",
      })
    }
  }

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

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
          <p className="text-muted-foreground">Your collection of saved stories.</p>
        </div>

        <div className="grid gap-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="p-4">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-2/5 mt-2" />
                </CardHeader>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </CardFooter>
              </Card>
            ))
          ) : favorites.length > 0 ? (
            favorites.map((favorite) => (
              <Card key={favorite.id} className="transition-all duration-200 hover:shadow-md">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1 flex-1">
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
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFavorite(favorite.storyId)}
                      className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Icons.trash className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <Button variant="outline" size="sm" asChild className="text-xs h-8">
                    <Link href={`https://news.ycombinator.com/item?id=${favorite.storyId}`} target="_blank">
                      <Icons.messageCircle className="h-3 w-3 mr-1" />
                      View comments
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Icons.heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No favorites yet</h3>
              <p className="text-muted-foreground mb-4">Start saving your favorite stories from the stories page.</p>
              <Button asChild>
                <Link href="/stories">Browse Stories</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

