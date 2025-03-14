"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { StoryCard } from "@/components/story-card"
import { useAuth } from "@/contexts/auth-context"
// Importez le fichier de configuration
import { config } from "@/config"

type Story = {
  id: number
  title: string
  url: string
  score: number
  by: string
  time: number
  descendants: number
}

export default function StoriesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, token } = useAuth()
  const [stories, setStories] = useState<Story[]>([])
  const [filteredStories, setFilteredStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("new")
  const [sortOrder, setSortOrder] = useState("score")
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true)
      try {
        let storyIds: number[] = []
        let endpoint = ""

        // Determine which API endpoint to use based on active tab
        switch (activeTab) {
          case "top":
            endpoint = "https://hacker-news.firebaseio.com/v0/topstories.json"
            break
          case "new":
            endpoint = "https://hacker-news.firebaseio.com/v0/newstories.json"
            break
          case "best":
            endpoint = "https://hacker-news.firebaseio.com/v0/beststories.json"
            break
          default:
            endpoint = "https://hacker-news.firebaseio.com/v0/topstories.json"
        }

        const response = await fetch(endpoint)
        storyIds = await response.json()

        // Only fetch first 30 stories for better performance
        const storiesToFetch = storyIds.slice(0, 30)

        const storyPromises = storiesToFetch.map((id) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((res) => res.json()),
        )

        const fetchedStories = await Promise.all(storyPromises)
        setStories(fetchedStories)

        // Also apply any existing filters
        filterAndSortStories(fetchedStories, searchQuery, sortOrder)

        // Get user favorites if authenticated
        if (isAuthenticated) {
          fetchUserFavorites()
        }
      } catch (error) {
        console.error("Error fetching stories:", error)
        toast({
          variant: "destructive",
          title: "Error fetching stories",
          description: "Failed to fetch stories. Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStories()
  }, [activeTab, isAuthenticated, searchQuery, sortOrder, toast])

  const fetchUserFavorites = async () => {
    try {
      if (!token) return

      // Dans fetchUserFavorites():
      const response = await fetch(`${config.apiUrl}/api/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites.map((fav: any) => fav.storyId))
      }
    } catch (error) {
      console.error("Error fetching favorites:", error)
    }
  }

  const filterAndSortStories = (storiesToFilter: Story[], query: string, order: string) => {
    let filtered = [...storiesToFilter]

    // Apply search filter if query exists
    if (query.trim() !== "") {
      filtered = filtered.filter(
        (story) =>
          story.title.toLowerCase().includes(query.toLowerCase()) ||
          (story.by && story.by.toLowerCase().includes(query.toLowerCase())),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (order === "score") {
        return b.score - a.score
      } else if (order === "time") {
        return b.time - a.time
      } else if (order === "comments") {
        return (b.descendants || 0) - (a.descendants || 0)
      }
      return 0
    })

    setFilteredStories(filtered)
  }

  useEffect(() => {
    filterAndSortStories(stories, searchQuery, sortOrder)
  }, [searchQuery, sortOrder, stories])

  const toggleFavorite = async (storyId: number) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to save favorites.",
      })
      router.push("/auth/login")
      return
    }

    try {
      if (favorites.includes(storyId)) {
        // Remove from favorites
        // Dans toggleFavorite() pour supprimer:
        const response = await fetch(`${config.apiUrl}/api/favorites/${storyId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          setFavorites(favorites.filter((id) => id !== storyId))
          toast({
            title: "Removed from favorites",
            description: "Story removed from your favorites",
          })
        }
      } else {
        // Add to favorites
        const story = stories.find((s) => s.id === storyId)

        if (!story) return

        // Dans toggleFavorite() pour ajouter:
        const response = await fetch(`${config.apiUrl}/api/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            storyId: story.id,
            title: story.title,
            url: story.url,
            by: story.by,
            score: story.score,
            time: story.time,
          }),
        })

        if (response.ok) {
          setFavorites([...favorites, storyId])
          toast({
            title: "Added to favorites",
            description: "Story added to your favorites",
          })
        }
      }
    } catch (error) {
      console.error("Error updating favorites:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorites",
      })
    }
  }

  return (
    <div className="container mx-auto py-8 animate-fadeIn">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Stories</h1>
          <p className="text-muted-foreground">Browse and discover the latest tech news and discussions.</p>
        </div>

        <div className="grid gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-3 md:w-auto">
                <TabsTrigger
                  value="top"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Top
                </TabsTrigger>
                <TabsTrigger
                  value="new"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  New
                </TabsTrigger>
                <TabsTrigger
                  value="best"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Best
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-1 items-center gap-2 md:max-w-sm">
              <Input
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 transition-all focus-visible:ring-primary"
              />
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-36 h-9">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Highest Points</SelectItem>
                  <SelectItem value="time">Newest</SelectItem>
                  <SelectItem value="comments">Most Comments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.05}s` }}>
                  <Skeleton className="h-[140px] w-full rounded-md" />
                </div>
              ))
            ) : filteredStories.length > 0 ? (
              filteredStories.map((story, index) => (
                <div key={story.id} className="animate-slideUp" style={{ animationDelay: `${index * 0.05}s` }}>
                  <StoryCard
                    story={story}
                    isFavorite={favorites.includes(story.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-12 animate-fadeIn">
                <Icons.search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No stories found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try a different search term" : "No stories available at the moment"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
