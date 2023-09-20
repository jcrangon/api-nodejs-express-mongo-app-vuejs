const express = require('express');
const router = express.Router();
const utils = require('../services/utils')
const { check, validationResult, body} = require('express-validator')
const Profile = require('../models/profile.model')
const passport = require('passport')
const jwt = require('jsonwebtoken');


// route permettant de visualiser le profile
router.post('/profile', 

passport.authenticate('jwt', { session: false }), 

async(req, res) =>{
  utils.logRequest(req)
  // res.send('visualisation du profile')
  try {
    // on récup le refresh token du cookie
    const refreshToken = req.cookies.refreshToken;

    // on vdecode le jeton
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // on chercheun objet Profile dansla base dont le
    // champ userId contient l'id de notre utilisateur:
    const profile = await Profile.findOne({userId: decoded.sub})
    if(!profile) {
      return res.status(400).json({ message: 'non trouvé' })
    } else {
      return res.status(200).json(profile)
    }

  } catch(err) {
    console.log('Error 500: ', err);
    return res.status(500).json(err);
  }
})



// route permettant de creer/modifier le profil
router.get('/profile/edit', 

passport.authenticate('jwt', { session: false }), 

[// on valide les données en provenance du frontend
body('lastName').isLength({ min: 3, max: 40 }).withMessage('Nom doit contenir entre 3 et 40 caractères'),
body('firstName').isLength({ min: 3, max: 40 }).withMessage('Prénom doit contenir entre 3 et 40 caractères'),
body('password').isDate().withMessage('Date de naissance non valide')
],

async (req, res) =>{
  utils.logRequest(req)
  // res.send('Creation/modification du profile')
  
  const errors = validationResult(req);
  // on verifie si la validation a retourné des erreurs
  if(!errors.isEmpty()){
      console.log('Errors:', errors.array())
      return res.status(400).json({ errors: errors.array() });
  }
  // on récup le refresh token du cookie
  const refreshToken = req.cookies.refreshToken;

  // on vdecode le jeton
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  // on chercheun objet Profile dansla base dont le
  // champ userId contient l'id de notre utilisateur:
  const profile = await Profile.findOne({userId: decoded.sub})

  if(!profile) {
    try {

      const newProfile = await new Profile(req.body)
      const saveProfile = await newProfile.save()
      console.log('201-Profile créé avec succès!')
      console.log('reponse:', saveProfile)
      console.log('Res Headers: ', res.headers)
      console.log('Res cookies: ', res.cookies)
      return res.status(200).json({ message: 'Profile créé avec succès', post: saveProfile});

    } catch(err) {
        console.log('Error 500: ', err)
        return res.status(500).json(err)
    }
  } else {

    try {
      if(profile.userId === req.body.userId) {
        await Profile.updateOne({$set: req.body})
        
        const updated = await Profile.findById(profile._id)

        console.log('201-Inscription réussie!')
        console.log('reponse:', updated)
        console.log('Res Headers: ', res.headers)
        console.log('Res cookies: ', res.cookies)
        res.status(200).json({message: 'Modifié avec succès', profileModifie: updated });

      } else {
          console.log('Error 403: Ce profile ne vous appartient pas');
          res.status(403).json({ message: 'Ce profile ne vous appartient pas' });
      }

    } catch(err) {
        console.log('Error 500: ', err)
        return res.status(500).json(err)
    }

  }

})



module.exports = router