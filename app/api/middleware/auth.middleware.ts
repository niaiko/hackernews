import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { db } from "../models"
import logger from "../utils/logger"

const User = db.User
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn(`Authentication failed: No Bearer token provided - ${req.originalUrl}`)
      return res.status(401).json({ message: "Authentication required" })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
      logger.warn(`Authentication failed: Empty token - ${req.originalUrl}`)
      return res.status(401).json({ message: "Authentication required" })
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number }

    // Find user
    const user = await User.findByPk(decoded.id)

    if (!user) {
      logger.warn(`Authentication failed: User not found for token - ${req.originalUrl}`)
      return res.status(401).json({ message: "User not found" })
    }

    // Add user to request
    req.user = user
    logger.debug(`User authenticated: ${user.username} (ID: ${user.id}) - ${req.method} ${req.originalUrl}`)
    next()
  } catch (error: any) {
    logger.error(`Authentication error: ${error.message} - ${req.originalUrl}`)
    return res.status(401).json({ message: "Invalid token" })
  }
}

