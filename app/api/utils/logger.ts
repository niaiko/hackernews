import winston from "winston"
import "winston-daily-rotate-file"
import path from "path"
import fs from "fs"

// Créer le dossier logs s'il n'existe pas
const logsDir = path.join(__dirname, "../logs")
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

// Définir les niveaux de log et leurs couleurs
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// Définir différentes couleurs pour chaque niveau
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
}

// Ajouter les couleurs à winston
winston.addColors(colors)

// Déterminer le niveau de log en fonction de l'environnement
const level = () => {
  const env = process.env.NODE_ENV || "development"
  return env === "development" ? "debug" : "info"
}

// Format personnalisé pour les logs
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
)

// Format pour la console avec couleurs
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
)

// Définir les transports (où les logs seront stockés)
const transports = [
  // Écrire tous les logs avec niveau 'error' et inférieur dans 'error.log'
  new winston.transports.DailyRotateFile({
    filename: path.join(logsDir, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "error",
    format: format,
  }),

  // Écrire tous les logs dans 'combined.log'
  new winston.transports.DailyRotateFile({
    filename: path.join(logsDir, "combined-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: format,
  }),

  // Afficher tous les logs dans la console
  new winston.transports.Console({
    format: consoleFormat,
  }),
]

// Créer l'instance du logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
})

export default logger

