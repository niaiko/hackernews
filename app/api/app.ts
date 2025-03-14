import express from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import path from "path"
import type { Request, Response, NextFunction } from "express"
import { db } from "./models"
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import favoriteRoutes from "./routes/favorite.routes"
import logger from "./utils/logger"

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => {
        logger.http(message.trim())
      },
    },
  }),
)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false
  }),
)

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, "uploads")
if (!require("fs").existsSync(uploadsDir)) {
  require("fs").mkdirSync(uploadsDir, { recursive: true })
  logger.info(`Created uploads directory at ${uploadsDir}`)
}

// Servir les fichiers statiques du dossier uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Default route
app.get("/", (req: Request, res: Response) => {
  logger.debug("Default route accessed")
  res.json({ message: "Welcome to the ModernHN API" })
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/favorites", favoriteRoutes)

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`)
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// Database initialization
const PORT = process.env.PORT || 4001

db.sequelize
  .sync()
  .then(() => {
    logger.info("Database synced successfully")
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`)
    })
  })
  .catch((err: Error) => {
    logger.error(`Failed to sync database: ${err.message}`)
  })

export default app

