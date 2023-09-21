const express = require('express')
require('dotenv').config()
const authRoutes = require('./v1/auth')
const postsRoutes = require('./v1/posts')
const userRoutes = require('./v1/user')
const helmet = require('helmet')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const utils = require('./services/utils')

// definition du port
const port = process.env.PORT || 5000;

// récuperation d'un server
const app = express();

// sécurisation grâce à la librairie helmet
app.use(helmet());


// désactivation du header x-powered-by
app.disable('x-powered-by');

// configuration des cors
const whitelist = ['http://localhost:8080']

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}

// permettre au server de transformer
// automatiquement le json du body de la requête
// en objet
app.use(express.json());

// activation des CORS
app.use(cors(corsOptions))

// création-configuration de la session
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false, // false => http, true => https
  },
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    autoRemove: 'interval',
    autoRemoveInterval: 10,
    dbName: 'simple-nodejs-api',
    //Si on veut crypter la table de sessions:
    // crypto: {
    //   secret: process.env.SESSION_SECRET
    // }
  })
}));

// cookie-parser
app.use(cookieParser())

// Middleware pour générer un jeton CSRF et l'ajouter aux cookies
app.use((req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = utils.generateCsrfToken()
  }

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
    // Vérifier le jeton CSRF pour les requêtes POST, PUT, DELETE
    const clientCsrfToken = req.cookies['csrf-token'] || req.headers['x-csrf-token'];

    if (!clientCsrfToken || clientCsrfToken !== req.session.csrfToken ) {
      return res.status(403).json({ message: 'Jetons CSRF invalides' });
    }
  }
  res.cookie('csrf-token', req.session.csrfToken, {
    httpOnly: true, // Le rend HttpOnly
  })
  next()
})

// creation des 2 régions de routes:
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postsRoutes);
app.use('/api/v1/user', userRoutes);

// permet de supprimer le probleme de CORS
// pour les images
app.use('/images', express.static('./images'))

// démarrage du server
app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});

module.exports = app