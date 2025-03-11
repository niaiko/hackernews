import express from "express"
import { body, validationResult } from "express-validator"
import bcrypt from "bcryptjs"
import multer from "multer"
import path from "path"
import fs from "fs"
import { db } from "../models"
import { authenticate } from "../middleware/auth.middleware"
import type { Request, Response } from "express"

const router = express.Router()
const User = db.User
const Favorite = db.Favorite

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, "profile-" + uniqueSuffix + ext)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error("Only image files are allowed"))
  },
})

// Get current user profile
router.get("/profile", authenticate, async (req: Request, res: Response) => {
  try {
    // User is already attached to request by authenticate middleware
    const user = req.user

    res.json(user.toSafeObject())
  } catch (error: any) {
    console.error("Get profile error:", error)
    res.status(500).json({
      message: "Failed to get profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Update user profile
router.put(
  "/profile",
  authenticate,
  upload.single("profileImage"),
  [
    body("username").optional().trim().isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
    body("email").optional().isEmail().withMessage("Please provide a valid email"),
    body("age").optional().isInt({ min: 13 }).withMessage("Age must be at least 13"),
    body("description").optional().isString(),
    body("profileVisibility").optional().isBoolean(),
    body("password").optional().isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  ],
  async (req: Request, res: Response) => {
    // Validate request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const user = req.user
      const updateData: any = {}

      // Check if username is being changed and if it's already taken
      if (req.body.username && req.body.username !== user.username) {
        const existingUser = await User.findOne({
          where: { username: req.body.username },
        })

        if (existingUser) {
          return res.status(400).json({
            message: "Username already in use",
          })
        }

        updateData.username = req.body.username
      }

      // Check if email is being changed and if it's already taken
      if (req.body.email && req.body.email !== user.email) {
        const existingUser = await User.findOne({
          where: { email: req.body.email },
        })

        if (existingUser) {
          return res.status(400).json({
            message: "Email already in use",
          })
        }

        updateData.email = req.body.email
      }

      // Update other fields
      if (req.body.age) updateData.age = req.body.age
      if (req.body.description !== undefined) updateData.description = req.body.description
      if (req.body.profileVisibility !== undefined) updateData.profileVisibility = req.body.profileVisibility

      // Update password if provided
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10)
        updateData.password = await bcrypt.hash(req.body.password, salt)
      }

      // Update profile image if provided
      if (req.file) {
        // If there's an existing profile image, delete it
        if (user.profileImageUrl) {
          const oldImagePath = path.join(__dirname, "..", user.profileImageUrl)
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath)
          }
        }

        // Set the new profile image URL
        updateData.profileImageUrl = `/uploads/${req.file.filename}`
      }

      // Update user
      await user.update(updateData)

      res.json({
        message: "Profile updated successfully",
        user: user.toSafeObject(),
      })
    } catch (error: any) {
      console.error("Update profile error:", error)
      res.status(500).json({
        message: "Failed to update profile",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
    }
  },
)

// Get public users (only those with profileVisibility = true)
router.get("/public", async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      where: { profileVisibility: true },
      attributes: ["id", "username", "age", "description", "profileImageUrl"],
    })

    res.json({ users })
  } catch (error: any) {
    console.error("Get public users error:", error)
    res.status(500).json({
      message: "Failed to get users",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Get a specific user by ID (only if profileVisibility = true)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
        profileVisibility: true,
      },
      attributes: ["id", "username", "age", "description", "profileImageUrl"],
    })

    if (!user) {
      return res.status(404).json({ message: "User not found or profile is private" })
    }

    res.json({ user })
  } catch (error: any) {
    console.error("Get user error:", error)
    res.status(500).json({
      message: "Failed to get user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Get a user's favorites (only if profileVisibility = true)
router.get("/:id/favorites", async (req: Request, res: Response) => {
  try {
    // First check if the user exists and has a public profile
    const user = await User.findOne({
      where: {
        id: req.params.id,
        profileVisibility: true,
      },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found or profile is private" })
    }

    // Get the user's favorites
    const favorites = await Favorite.findAll({
      where: { userId: req.params.id },
      order: [["createdAt", "DESC"]],
    })

    res.json({ favorites })
  } catch (error: any) {
    console.error("Get user favorites error:", error)
    res.status(500).json({
      message: "Failed to get user favorites",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

export default router

