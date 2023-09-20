const express = require('express')
const router = express.Router()
const utils = require('../services/utils')
const { validationResult, body } = require('express-validator')
const Post = require('../models/post.model')
const User = require('../models/user.model')
const passport = require('../strategies/passport')
const multer = require('multer')
const path = require('path')
// Configuration de Multer pour gérer l'upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/'); // Dossier où seront sauvegardés les fichiers
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
// definition de upload
const upload = multer({ storage: storage })



// route permetant de creer un nouvel article
router.post('/add', 

passport.authenticate('jwt', { session: false }), 

// upload du fichier
upload.single('imageFile'),

async (req,res) => {
  utils.logRequest(req)
  console.log('req.file: ', req.file)
  // res.send('Ajout d\'un nouvel article')

  // si pas de fichier envoyé
  // on utilisera l'image generique
  if(!req.file) {
    try {
      const newPost = await new Post(req.body);
      const savePost = await newPost.save();
      console.log('200-Création réussie!')
      console.log('reponse:', savePost)
      console.log('Res Headers: ', res.headers)
      console.log('Res cookies: ', res.cookies)
      return res.status(200).json({ message: 'post successfully added', post: savePost});
    } catch(err) {
      console.error('Error 500: ', err);
      return res.status(500).json(err);
    }
  } else {
    try {
      const imageUrl = `/images/${req.file.filename}`;
      const newPost = await new Post(req.body);
      newPost.cover = imageUrl
      const savePost = await newPost.save();
      console.log('200-Création réussie!')
      console.log('reponse:', savePost)
      console.log('Res Headers: ', res.headers)
      console.log('Res cookies: ', res.cookies)
      return res.status(200).json({ message: 'post successfully added', post: savePost});
    } catch(err) {
      console.error('Error 500: ', err);
      return res.status(500).json(err);
    }
  }
})

// route permetant de récupérer les articles
// paginés et trié par date décroissantes
router.get('/page/:page/:articlesPerPage', async (req,res) => {
  utils.logRequest(req)
  // res.send(`Récupérer les articles paginés à partir de la page ${req.params.page} avec ${req.params.articlesPerPage} articles par page`)
  try {
    const page = req.params.page
    const pagePer = req.params.articlesPerPage
    const posts = await Post.find().limit (pagePer).skip (pagePer*(page-1));
    console.log('200-Création réussie!')
    console.log('reponse:', posts)
    console.log('Res Headers: ', res.headers)
    console.log('Res cookies: ', res.cookies)
    return res.status(200).json(posts);
  } catch(err) {
    console.error('Error 500: ', err);
    return res.status(500).json(err);
  }
})

// route permetant de récupérer un article
// par son id
router.get('/:id', async (req,res) => {
  utils.logRequest(req)
  // res.send(`Récupérer l'article dont l'id est: ${req.params.id}`)
  try {
    const post = await Post.findById(req.params.id);
    console.log('200-article récupéré avec succès!')
    console.log('reponse:', post)
    console.log('Res Headers: ', res.headers)
    console.log('Res cookies: ', res.cookies)
    return res.status(200).json(post);
  } catch(err) {
    console.error('Error 500: ', err);
    return res.status(500).json(err);
  }
})

// route permetant de modifier un article
router.patch('/update/:id',

passport.authenticate('jwt', { session: false }), 

async (req,res) => {
  utils.logRequest(req)
  // res.send(`Modifier l'article dont l'id est: ${req.params.id}`)

  try {
    const post = await Post.findById(req.params.id);

    if(post.userId === req.body.userId) {
        await Post.updateOne({$set: req.body})
        
        const updated = await Post.findById(post._id)
        console.log('200-article modifié avec succès!')
        console.log('reponse:', updated)
        console.log('Res Headers: ', res.headers)
        console.log('Res cookies: ', res.cookies)
        res.status(200).json({message: 'update successful', updatedPost: updated });

    } else {
      console.error('Error 403: Ce post ne vous appartient pas');
      res.status(403).json({ message: 'Ce post ne vous appartient pas' });
    }
  } catch(err) {
    console.error('Error 500: ', err);
    res.status(500).json(err);
  }
  
})

// route permetant de supprimer un article
router.delete('/delete/:id', 

passport.authenticate('jwt', { session: false }),

async (req,res) => {
  utils.logRequest(req)
  // res.send(`Supprimer l'article dont l'id est: ${req.params.id}`)

  try {
    const post = await Post.findById(req.params.id);
    
    // Vérifier si le post existe
    if (!post) {
      console.error('Error 404: Post non trouvé');
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    if (post.userId === req.body.userId) {
        await post.deleteOne();
        console.log('200-article supprimé avec succès!')
        console.log('reponse:', updated)
        console.log('Res Headers: ', res.headers)
        console.log('Res cookies: ', res.cookies)
        return res.status(200).json({ message: 'Supprimé avec succès' });
    } else {
      console.error('Error 403: Vous n\'êtes pas autorisé à supprimer ce post');
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer ce post' });
    }
  } catch (err) {
    console.error('Error 500: ', err);
    res.status(500).json({ message: 'Erreur lors de la suppression du post', error: err });
  }
})

module.exports = router