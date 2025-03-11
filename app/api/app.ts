import express from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import type { Request, Response, NextFunction } from "express"
import { db } from "./models"
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import favoriteRoutes from "./routes/favorite.routes"

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
)

// Default route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the ModernHN API" })
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/favorites", favoriteRoutes)

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
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
    console.log("Database synced successfully")
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err: Error) => {
    console.error("Failed to sync database:", err)
  })

export default app

