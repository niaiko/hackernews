import express from "express"
import { body, validationResult } from "express-validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { db } from "../models"
import type { Request, Response } from "express"
import {Op} from "sequelize";
import logger from "../utils/logger"

const router = express.Router()
const User = db.User

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Register a new user
router.post(
  "/register",
  [
    body("username").trim().isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("age").isInt({ min: 13 }).withMessage("Age must be at least 13"),
  ],
  async (req: Request, res: Response) => {
    // Validate request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      logger.warn(`Registration validation failed: ${JSON.stringify(errors.array())}`)
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      // Check if username or email already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ username: req.body.username }, { email: req.body.email }],
        },
      })

      if (existingUser) {
        logger.warn(`Registration failed: Username or email already in use - ${req.body.username} / ${req.body.email}`)
        return res.status(400).json({
          message: "Username or email already in use",
        })
      }

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body.password, salt)

      // Create user
      const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        age: req.body.age,
        description: req.body.description || "",
        profileVisibility: req.body.profileVisibility !== undefined ? req.body.profileVisibility : true,
      })

      // Generate JWT
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" })
      logger.info(`User registered successfully: ${user.username} (ID: ${user.id})`)
      // Return user data without password and token
      res.status(201).json({
        message: "User registered successfully",
        token,
        user: user.toSafeObject(),
      })
    } catch (error: any) {
      logger.error(`Registration error: ${error.message}`)
      res.status(500).json({
        message: "Failed to register user",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
    }
  },
)

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req: Request, res: Response) => {
    // Validate request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      logger.warn(`Login validation failed: ${JSON.stringify(errors.array())}`)
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      // Find user by email
      const user = await User.findOne({
        where: { email: req.body.email },
      })

      if (!user) {
        logger.warn(`Login failed: Invalid credentials for email ${req.body.email}`)
        return res.status(401).json({
          message: "Invalid credentials",
        })
      }

      // Check password
      const isMatch = await bcrypt.compare(req.body.password, user.password)
      if (!isMatch) {
        logger.warn(`Login failed: Invalid password for user ${user.username} (ID: ${user.id})`)
        return res.status(401).json({
          message: "Invalid credentials",
        })
      }

      // Generate JWT
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" })
      logger.info(`User logged in successfully: ${user.username} (ID: ${user.id})`)
      // Return user data without password and token
      res.json({
        message: "Login successful",
        token,
        user: user.toSafeObject(),
      })
    } catch (error: any) {
      logger.error(`Login error: ${error.message}`)
      res.status(500).json({
        message: "Failed to login",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
    }
  },
)

export default router

