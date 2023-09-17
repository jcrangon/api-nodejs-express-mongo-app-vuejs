const express = require('express');
const router = express.Router();
const utils = require('../services/utils')
const { check, validationResult, body} = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model')
const localStrategy = require('../strategies/local.strategy')
const jwtStrategy = require('../strategies/jwt.strategy')

const passport = require('passport')

// configuration de passport
passport.use(localStrategy)
passport.use(jwtStrategy)

// route permetant de creer un compte utilisateur
router.post('/register', 
[// on valide les données en provenance du frontend
  body('email').isEmail().withMessage('Adresse Email invalide!'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe doit contenir au moins 6 carateres'),
  body('confirmPassword').custom((value, {req}) => {
      if(value !== req.body.password) {
          throw new Error('Les mots de passe ne correspondent pas!');
      }
      return true;
  })
],
async (req,res) => {
  utils.logRequest(req)
  // req.session.maVariable = 'test'
  
  //res.send('Enregistrement d\'un utilisateur')
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  User.findOne({ email })
  .then((user) => {
      if(user) {
          return res.status(400).json({ messsage: "L'utilisateur existe déjà" });
      }
      // Si l'utilisateur n'existe pas déjà, on le crée

      const newUser = new User({ email, password });

      bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err){
                  throw err;
              }

              newUser.password = hash;
              newUser.save()
              .then((user) => {
                  res.status(201).json({ message: 'Inscription réussie!', user });
              })
              .catch((err) => {
                  console.log(err);
                  res.status(500).json({ message: 'Erreur lors de l\'enregistrement' });
              })
          })
      })
  })
  .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Erreur lors de la recherche de l\'utilisateur.' });
  })
})

// route permettant le login d'un utilisateur
router.post('/login', async (req,res) => {
  utils.logRequest(req)
  res.send('Connexion d\'un utilisateur')
})

// route permettant la déconnexion d'un utilisateur
router.post('/logout', async (req,res) => {
  utils.logRequest(req)
  res.send('Déconnexion d\'un utilisateur')
})

module.exports = router