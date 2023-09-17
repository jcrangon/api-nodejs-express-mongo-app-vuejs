const express = require('express')
require('dotenv').config()
const authRoutes = require('./v1/auth')
const postsRoutes = require('./v1/posts')
const helmet = require('helmet')
const session = require('express-session')
const MongoStore = require('connect-mongo')

// definition du port
const port = process.env.PORT || 5000;

// récuperation d'un server
const app = express();

// sécurisation grâce à la librairie helmet
app.use(helmet());

// désactivation du header x-powered-by
app.disable('x-powered-by');

// permettre au server de transformer
// automatiquement le json du body de la requête
// en objet
app.use(express.json());


// création-configuration de la session
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
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

// creation des 2 régions de routes:
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postsRoutes);

// démarrage du server
app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});

module.exports = app