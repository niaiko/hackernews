"use client"

import Link from "next/link"
import { useState } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"

interface StoryCardProps {
  story: {
    id: number
    title: string
    url?: string
    score: number
    by: string
    time: number
    descendants?: number
  }
  isFavorite: boolean
  onToggleFavorite: (storyId: number) => Promise<void>
}

export function StoryCard({ story, isFavorite, onToggleFavorite }: StoryCardProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

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

  const handleFavoriteClick = async () => {
    setIsLoading(true)
    try {
      await onToggleFavorite(story.id)
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorites",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg leading-tight">
              <Link
                href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
                target="_blank"
                className="hover:underline flex items-start"
              >
                {story.title}
                {story.url && <Icons.externalLink className="ml-1 h-3 w-3 flex-shrink-0 mt-1.5" />}
              </Link>
            </CardTitle>
            <CardDescription className="flex items-center text-xs gap-2">
              <span className="font-medium">{story.score} points</span>
              <span>by {story.by}</span>
              <span>{formatTime(story.time)}</span>
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className="flex-shrink-0"
          >
            {isLoading ? (
              <Icons.spinner className="h-4 w-4 animate-spin" />
            ) : (
              <Icons.heart className={`h-4 w-4 ${isFavorite ? "fill-primary" : ""}`} />
            )}
            <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
          </Button>
        </div>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button variant="outline" size="sm" asChild className="text-xs h-8">
          <Link href={`https://news.ycombinator.com/item?id=${story.id}`} target="_blank">
            <Icons.messageCircle className="h-3 w-3 mr-1" />
            {story.descendants || 0} comments
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

