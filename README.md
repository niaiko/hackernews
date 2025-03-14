
...
```

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│             │       │             │       │             │
│  Frontend   │◄─────►│  Backend    │◄─────►│  Database   │
│  (Next.js)  │       │  (Express)  │       │ (PostgreSQL)│
│             │       │             │       │             │
└─────────────┘       └─────────────┘       └─────────────┘

```plaintext

- Le **Frontend** communique avec le Backend via des requêtes HTTP.
- Le **Backend** expose une API RESTful et gère la logique métier.
- La **Base de données** stocke les données des utilisateurs, leurs favoris, etc.

## Technologies utilisées

### Backend
- **Node.js** : Environnement d'exécution JavaScript
- **Express** : Framework web pour Node.js
- **Sequelize** : ORM pour PostgreSQL
- **PostgreSQL** : Système de gestion de base de données relationnelle
- **JWT** : JSON Web Tokens pour l'authentification
- **bcryptjs** : Bibliothèque pour le hachage des mots de passe
- **Winston** : Bibliothèque de journalisation
- **Multer** : Middleware pour la gestion des uploads de fichiers
- **Helmet** : Middleware pour la sécurité des en-têtes HTTP
- **CORS** : Middleware pour la gestion des requêtes cross-origin
- **TypeScript** : Superset typé de JavaScript

### Frontend
- **Next.js** : Framework React avec rendu côté serveur
- **React** : Bibliothèque JavaScript pour construire des interfaces utilisateur
- **Tailwind CSS** : Framework CSS utilitaire
- **Axios** : Client HTTP pour les requêtes API
- **React Query** : Bibliothèque pour la gestion des requêtes API
- **TypeScript** : Superset typé de JavaScript

## Structure du projet

### Structure du Backend

``

api/
├── logs/                  # Dossier des fichiers de logs
├── middleware/            # Middleware personnalisés
│   └── auth.middleware.ts # Middleware d'authentification
├── models/                # Modèles Sequelize
│   ├── index.ts           # Point d'entrée des modèles
│   ├── user.model.ts      # Modèle utilisateur
│   └── favorite.model.ts  # Modèle favoris
├── routes/                # Routes API
│   ├── auth.routes.ts     # Routes d'authentification
│   ├── user.routes.ts     # Routes utilisateur
│   └── favorite.routes.ts # Routes favoris
├── uploads/               # Dossier pour les fichiers uploadés
├── utils/                 # Utilitaires
│   └── logger.ts          # Configuration de Winston
├── app.ts                 # Configuration de l'application Express
├── server.ts              # Point d'entrée du serveur
└── package.json           # Dépendances et scripts

```plaintext

### Structure du Frontend

``

frontend/
├── app/                   # Structure des routes Next.js App Router
│   ├── api/               # Routes API côté client
│   ├── auth/              # Pages d'authentification
│   ├── profile/           # Pages de profil
│   ├── favorites/         # Pages des favoris
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── ui/                # Composants UI réutilisables
│   ├── auth/              # Composants liés à l'authentification
│   ├── profile/           # Composants liés au profil
│   └── story/             # Composants liés aux articles
├── config/                # Configuration
│   └── index.ts           # Variables de configuration
├── hooks/                 # Hooks personnalisés
├── lib/                   # Bibliothèques et utilitaires
├── public/                # Fichiers statiques
├── styles/                # Styles globaux
├── types/                 # Types TypeScript
├── .env.local             # Variables d'environnement locales
└── package.json           # Dépendances et scripts

```plaintext

## Installation et configuration

### Prérequis
- Node.js (v14+)
- PostgreSQL (v12+)
- npm ou yarn

### Installation du Backend

1. Cloner le dépôt
   ```bash
   git clone https://github.com/votre-username/hackernews-clone.git
   cd hackernews-clone/api
```

2. Installer les dépendances

```shellscript
npm install
```


3. Configurer les variables d'environnement

```plaintext
PORT=4001
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_NAME=hackernews
DB_HOST=localhost
JWT_SECRET=votre_secret_jwt
NODE_ENV=development
```


4. Initialiser la base de données

```shellscript
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```


5. Démarrer le serveur

```shellscript
npm run dev
```




### Installation du Frontend

1. Naviguer vers le dossier frontend

```shellscript
cd ../frontend
```


2. Installer les dépendances

```shellscript
npm install
```


3. Configurer les variables d'environnement

```plaintext
NEXT_PUBLIC_API_URL=http://localhost:4001
```


4. Démarrer le serveur de développement

```shellscript
npm run dev
```




## API

### Endpoints

#### Authentification

| Méthode | Endpoint | Description | Authentification requise
|-----|-----|-----|-----
| POST | `/api/auth/register` | Inscription d'un nouvel utilisateur | Non
| POST | `/api/auth/login` | Connexion d'un utilisateur | Non


#### Utilisateurs

| Méthode | Endpoint | Description | Authentification requise
|-----|-----|-----|-----
| GET | `/api/users/profile` | Récupérer le profil de l'utilisateur connecté | Oui
| PUT | `/api/users/profile` | Mettre à jour le profil de l'utilisateur | Oui
| GET | `/api/users/public` | Récupérer la liste des utilisateurs publics | Non
| GET | `/api/users/:id` | Récupérer un utilisateur spécifique | Non
| GET | `/api/users/:id/favorites` | Récupérer les favoris d'un utilisateur | Non
| GET | `/api/users/:id/avatar` | Récupérer l'avatar d'un utilisateur | Non
| GET | `/api/default-avatar` | Générer un avatar par défaut | Non


#### Favoris

| Méthode | Endpoint | Description | Authentification requise
|-----|-----|-----|-----
| GET | `/api/favorites` | Récupérer les favoris de l'utilisateur connecté | Oui
| POST | `/api/favorites` | Ajouter un article aux favoris | Oui
| DELETE | `/api/favorites/:storyId` | Supprimer un article des favoris | Oui


### Modèles de données

#### Utilisateur (User)
````
| Champ | Type | Description
|-----|-----|-----|-----
| id | Integer | Identifiant unique (clé primaire)
| username | String | Nom d'utilisateur (unique)
| email | String | Adresse email (unique)
| password | String | Mot de passe haché
| age | Integer | Âge de l'utilisateur
| description | Text | Description du profil
| profileVisibility | Boolean | Visibilité du profil (public/privé)
| profileImageUrl | String | URL de l'image de profil
| createdAt | Date | Date de création
| updatedAt | Date | Date de dernière mise à jour


#### Favori (Favorite)

| Champ | Type | Description
|-----|-----|-----|-----
| id | Integer | Identifiant unique (clé primaire)
| userId | Integer | ID de l'utilisateur (clé étrangère)
| storyId | Integer | ID de l'article sur Hacker News
| title | String | Titre de l'article
| url | String | URL de l'article (optionnel)
| by | String | Auteur de l'article
| score | Integer | Score de l'article
| time | Integer | Timestamp de publication
| createdAt | Date | Date d'ajout aux favoris
| updatedAt | Date | Date de dernière mise à jour
````

### Middleware

#### Middleware d'authentification

Le middleware d'authentification vérifie la validité du token JWT fourni dans l'en-tête `Authorization` et attache l'utilisateur à l'objet `request` si le token est valide.

```typescript
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Récupérer le token depuis l'en-tête
    const authHeader = req.headers.authorization;
    
    // Vérifier la présence et la validité du token
    // ...
    
    // Attacher l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    // Gérer les erreurs
    // ...
  }
};
```

## Frontend

### Composants

#### Composants principaux

- **Header** : Barre de navigation principale avec logo, liens et état d'authentification
- **Story** : Affichage d'un article de Hacker News
- **StoryList** : Liste d'articles
- **Profile** : Affichage et édition du profil utilisateur
- **LoginForm** / **RegisterForm** : Formulaires d'authentification
- **FavoritesList** : Liste des articles favoris


### Gestion d'état

La gestion d'état est principalement assurée par React Query pour les données provenant de l'API, et par les hooks React (useState, useContext) pour l'état local.

### Routage

Le routage est géré par Next.js App Router, avec une structure de dossiers qui reflète les routes de l'application.

## Authentification et sécurité

### Authentification

L'authentification est basée sur les JSON Web Tokens (JWT) :

1. L'utilisateur s'inscrit ou se connecte via les endpoints d'authentification.
2. Le serveur génère un JWT contenant l'ID et le nom d'utilisateur.
3. Le token est renvoyé au client et stocké localement.
4. Pour les requêtes authentifiées, le client inclut le token dans l'en-tête `Authorization`.
5. Le middleware d'authentification vérifie la validité du token.


### Sécurité

- **Hachage des mots de passe** : Les mots de passe sont hachés avec bcryptjs avant d'être stockés.
- **Protection CSRF** : Mise en œuvre via des tokens.
- **Helmet** : Configuration des en-têtes HTTP pour améliorer la sécurité.
- **Validation des entrées** : Utilisation d'express-validator pour valider les données entrantes.
- **Limitation de la taille des uploads** : Restriction à 5 MB pour les images de profil.


## Journalisation (Logging)

Le système de journalisation est basé sur Winston et offre les fonctionnalités suivantes :

### Configuration

```typescript
// utils/logger.ts
import winston from 'winston';
import 'winston-daily-rotate-file';

// Définition des niveaux de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Configuration des transports
const transports = [
  // Fichier d'erreurs
  new winston.transports.DailyRotateFile({
    filename: 'error-%DATE%.log',
    level: 'error',
    // ...
  }),
  
  // Fichier combiné
  new winston.transports.DailyRotateFile({
    filename: 'combined-%DATE%.log',
    // ...
  }),
  
  // Console
  new winston.transports.Console({
    format: consoleFormat,
  }),
];

// Création du logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default logger;
```

### Utilisation

```typescript
import logger from '../utils/logger';

// Différents niveaux de log
logger.error('Message d'erreur critique');
logger.warn('Avertissement');
logger.info('Information générale');
logger.http('Requête HTTP');
logger.debug('Information de débogage');
```

### Rotation des fichiers

Les fichiers de logs sont automatiquement :

- Divisés par jour (`%DATE%` dans le nom du fichier)
- Compressés lorsqu'ils atteignent 20 MB
- Conservés pendant 14 jours


### Intégration avec Morgan

Morgan est configuré pour utiliser Winston pour les logs HTTP :

```typescript
app.use(morgan('combined', {
  stream: {
    write: (message: string) => {
      logger.http(message.trim());
    },
  },
}));
```

## Gestion des fichiers et avatars

### Upload d'images de profil

L'upload d'images de profil est géré par Multer :

```typescript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Définir le dossier de destination
    // ...
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique
    // ...
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    // Filtrer les types de fichiers
    // ...
  },
});
```

### Avatars par défaut

Pour les utilisateurs sans image de profil, un avatar par défaut est généré à partir de leurs initiales :

```typescript
router.get("/default-avatar", (req: Request, res: Response) => {
  // Générer un SVG avec les initiales de l'utilisateur
  // ...
});
```

## Déploiement

### Backend

#### Déploiement sur un serveur VPS

1. Configurer un serveur avec Node.js et PostgreSQL
2. Cloner le dépôt
3. Installer les dépendances
4. Configurer les variables d'environnement
5. Compiler le TypeScript
6. Démarrer l'application avec PM2


```shellscript
npm install -g pm2
npm run build
pm2 start dist/server.js --name "hackernews-api"
```

#### Déploiement sur Heroku

1. Créer une application Heroku
2. Configurer l'add-on PostgreSQL
3. Configurer les variables d'environnement
4. Déployer l'application


```shellscript
heroku create hackernews-api
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set JWT_SECRET=votre_secret_jwt
git push heroku main
```

### Frontend

#### Déploiement sur Vercel

1. Connecter le dépôt GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer l'application


## Bonnes pratiques

### Conventions de code

- **Nommage** : camelCase pour les variables et fonctions, PascalCase pour les classes et composants
- **Indentation** : 2 espaces
- **Commentaires** : JSDoc pour les fonctions et classes importantes
- **Gestion des erreurs** : Try/catch pour les opérations asynchrones


### Sécurité

- Ne jamais stocker de secrets dans le code source
- Valider toutes les entrées utilisateur
- Utiliser des requêtes paramétrées pour les requêtes SQL
- Limiter les informations dans les messages d'erreur en production


### Performance

- Utiliser la pagination pour les listes longues
- Mettre en cache les résultats fréquemment demandés
- Optimiser les requêtes de base de données avec des index


## Dépannage

### Problèmes courants

#### Erreur de connexion à la base de données

**Symptôme** : Le serveur ne démarre pas avec une erreur de connexion à la base de données.

**Solution** :

1. Vérifier que PostgreSQL est en cours d'exécution
2. Vérifier les informations de connexion dans les variables d'environnement
3. Vérifier que l'utilisateur a les permissions nécessaires


#### Problèmes d'authentification

**Symptôme** : Les requêtes authentifiées échouent avec une erreur 401.

**Solution** :

1. Vérifier que le token JWT est correctement envoyé dans l'en-tête `Authorization`
2. Vérifier que le token n'est pas expiré
3. Vérifier que la variable d'environnement `JWT_SECRET` est correctement définie


#### Problèmes d'upload de fichiers

**Symptôme** : Les uploads d'images échouent.

**Solution** :

1. Vérifier que le dossier `uploads` existe et a les permissions d'écriture
2. Vérifier que la taille du fichier ne dépasse pas la limite (5 MB)
3. Vérifier que le type de fichier est autorisé (jpeg, jpg, png, gif)


```plaintext

Cette documentation technique fournit une vue d'ensemble complète du projet Hacker News Clone, couvrant tous les aspects techniques importants. Elle servira de référence pour les développeurs travaillant sur le projet et facilitera l'intégration de nouveaux membres dans l'équipe.
```