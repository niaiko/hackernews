import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { db } from "../models"

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
      return res.status(401).json({ message: "Authentication required" })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "Authentication required" })
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number }

    // Find user
    const user = await User.findByPk(decoded.id)

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    // Add user to request
    req.user = user
    next()
  } catch (error) {
    console.error("Authentication error:", error)
    return res.status(401).json({ message: "Invalid token" })
  }
}

