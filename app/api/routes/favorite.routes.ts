import express from "express"
import { body, validationResult } from "express-validator"
import { db } from "../models"
import { authenticate } from "../middleware/auth.middleware"
import type { Request, Response } from "express"
import logger from "../utils/logger"

const router = express.Router()
const Favorite = db.Favorite

// Get current user's favorites
router.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    })
    logger.debug(`Retrieved ${favorites.length} favorites for user ${req.user.username} (ID: ${req.user.id})`)
    res.json({ favorites })
  } catch (error: any) {
    logger.error(`Get favorites error: ${error.message} - User ID: ${req.user?.id}`)
    res.status(500).json({
      message: "Failed to get favorites",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Add a story to favorites
router.post(
  "/",
  authenticate,
  [
    body("storyId").isInt().withMessage("Story ID must be an integer"),
    body("title").notEmpty().withMessage("Title is required"),
    body("by").notEmpty().withMessage("Author is required"),
    body("score").isInt().withMessage("Score must be an integer"),
    body("time").isInt().withMessage("Time must be an integer"),
  ],
  async (req: Request, res: Response) => {
    // Validate request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      logger.warn(`Add favorite validation failed: ${JSON.stringify(errors.array())} - User ID: ${req.user.id}`)
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      // Check if the story is already in favorites
      const existingFavorite = await Favorite.findOne({
        where: {
          userId: req.user.id,
          storyId: req.body.storyId,
        },
      })

      if (existingFavorite) {
        logger.warn(`Story already in favorites: Story ID ${req.body.storyId} - User ID: ${req.user.id}`)
        return res.status(400).json({
          message: "Story is already in favorites",
        })
      }

      // Add to favorites
      const favorite = await Favorite.create({
        userId: req.user.id,
        storyId: req.body.storyId,
        title: req.body.title,
        url: req.body.url || null,
        by: req.body.by,
        score: req.body.score,
        time: req.body.time,
      })
      logger.info(`Story added to favorites: Story ID ${req.body.storyId} - User ID: ${req.user.id}`)
      res.status(201).json({
        message: "Story added to favorites",
        favorite,
      })
    } catch (error: any) {
      logger.error(`Add favorite error: ${error.message} - User ID: ${req.user.id}`)
      res.status(500).json({
        message: "Failed to add favorite",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
    }
  },
)

// Remove a story from favorites
router.delete("/:storyId", authenticate, async (req: Request, res: Response) => {
  try {
    const storyId = Number.parseInt(req.params.storyId)

    if (isNaN(storyId)) {
      logger.warn(`Invalid story ID for delete favorite: ${req.params.storyId} - User ID: ${req.user.id}`)
      return res.status(400).json({
        message: "Invalid story ID",
      })
    }

    // Find and delete the favorite
    const favorite = await Favorite.findOne({
      where: {
        userId: req.user.id,
        storyId,
      },
    })

    if (!favorite) {
      logger.warn(`Favorite not found for delete: Story ID ${storyId} - User ID: ${req.user.id}`)
      return res.status(404).json({
        message: "Favorite not found",
      })
    }

    await favorite.destroy()
    logger.info(`Story removed from favorites: Story ID ${storyId} - User ID: ${req.user.id}`)
    res.json({
      message: "Story removed from favorites",
    })
  } catch (error: any) {
    logger.error(`Remove favorite error: ${error.message} - User ID: ${req.user.id}`)
    res.status(500).json({
      message: "Failed to remove favorite",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

export default router

