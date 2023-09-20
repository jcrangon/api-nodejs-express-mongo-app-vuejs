const express = require('express')
const router = express.Router()
const utils = require('../services/utils')
const { validationResult, body} = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user.model')
const RefreshToken = require('../models/refreshToken.model')
const passport = require('../strategies/passport')
const jwt = require('jsonwebtoken')

const database = require('../db')



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
// gestionnaire de route
async (req,res) => {
  utils.logRequest(req)
  // req.session.maVariable = 'test'
  
  //res.send('Enregistrement d\'un utilisateur')
  const errors = validationResult(req);
  // on verifie si la validation a retourné des erreurs
  if(!errors.isEmpty()){
      console.log('Errors:', errors.array())
      return res.status(400).json({ errors: errors.array() });
  }

  // la validation n'a pas retourné d'erreurs
  // on récupère les identifiant et mot de passe du body
  // de la requete
  const { email, password } = req.body;

  // on récupère l'utilisateurde la base de donnée
  // avec l'email
  User.findOne({ email })
  .then((user) => {
      // l'utilisateur existe en bdd
      if(user) {
        // on ne peut pas réinscrire le meme utilisateur s'il
        // existe
        console.error('Error 400: L\'utilisateur existe déjà')
          return res.status(400).json({ messsage: "L'utilisateur existe déjà" });
      }

      // Si l'utilisateur n'existe pas déjà, on le crée
      // on cree un objet user à partir des données reçues
      const newUser = new User({ email, password });

      // on crypte le mot de passe
      bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err){
                  throw err;
              }
              newUser.password = hash;
              // on enregistre le nouvel utilisateur dans la base
              newUser.save()
              .then((user) => {
                  // rponse 201 OK
                  console.log('201-Inscription réussie!')
                  console.log('reponse:', user)
                  console.log('Res Headers: ', res.headers)
                  console.log('Res cookies: ', res.cookies)
                  res.status(201).json({ message: 'Inscription réussie!', user });
              })
              .catch((err) => {
                // en cas d'erreur de réseau
                  console.error('Error 500: ', err);
                  res.status(500).json({ message: 'Erreur lors de l\'enregistrement' });
              })
          })
      })
  })
  .catch((err) => {
    // en cas d'erreur de réseau
      console.log('Error 500: ', err);
      res.status(500).json({ message: 'Erreur lors de la recherche de l\'utilisateur.' });
  })
})


// route permettant le login d'un utilisateur
router.post(
  '/login', 
  // on declenche la vérification passport avec la strategie locale
  passport.authenticate('local', { session: false }), 
  
  // gestionnaire de route
  async (req,res) => {

    utils.logRequest(req)
    // res.send('Connexion d\'un utilisateur')

    // on crée le token d'authentification
    const token = jwt.sign({ sub: req.user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    
    // on crée le token d'autorisation
    const refreshToken = jwt.sign({ sub: req.user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // On crée un objet RefreshToken car on va 
    // l'enregistrer dans la base.
    const RefreshModel = new RefreshToken({ token: refreshToken });

    try {
        await RefreshModel.save();
    } catch (err) {
        console.log('Error: ',err);
        return res.status(500).json({ message: "Erreur lors de l'enregistrement du refreshToken" });
    }

    // necessaire pour envoyer un cookie httpOnly 
    // dans certaine conditions
    //res.setHeader('Access-Control-Allow-Credentials', 'true')
    req.session.start = true
    res.cookie('refreshToken', refreshToken, {httpOnly: true})
    res.json({ token: token });
    
    // debug:
    // res.json({ token: token, refresh: refreshToken });
})

// route permettant la déconnexion d'un utilisateur
router.post('/logout', async (req,res) => {
  utils.logRequest(req)
  // res.send('Déconnexion d\'un utilisateur')
  // on récup le refresh token du cookie
 
  const refreshToken = req.cookies.refreshToken;

  // suppression des cookies
  await res.clearCookie('refreshToken');
  await res.clearCookie('connect.sid');
 
  
  // //regeneration de l'id de session
  req.session.destroy();

  // on essaie de le trouver dans la DB
  await RefreshToken.deleteOne({ token: refreshToken });

  // on envoie la réponse
  res.status(200).json({ message: 'Déconnexion réussie' });
})



router.post('/refresh-token', async (req, res) => {
  // on récup le refresh token du cookie
  const refreshToken = req.cookies.refreshToken;

  console.log('recupération du cookie:', refreshToken)

  // on verifie sa validité
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  //cas ou il est invalide
  if(!decoded) {
      return res.status(401).json({ message: 'refresh token invalid' });
  }

  // on essaie de le trouver dans la DB
  const existingToken = await RefreshToken.findOne({ token: refreshToken });
  
  // Si on le trouve pas
  if(!existingToken) {
      return res.status(401).json({ message: 'Refresh token non trouvé' });
  }
  // On regénère un nouveau Token
  const user = { _id: decoded.sub };
  const token = jwt.sign({ sub: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

  // on le renvoi au middleware de l'app
  res.json({ token: token });

})

module.exports = router