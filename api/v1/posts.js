const express = require('express');
const router = express.Router();
const utils = require('../services/utils')

// route permetant de creer un nouvel article
router.post('/add', async (req,res) => {
  utils.logRequest(req)
  res.send('Ajout d\'un nouvel article')
})

// route permetant de récupérer les articles
// paginés et trié par date décroissantes
router.get('/page/:page/:articlesPerPage', async (req,res) => {
  utils.logRequest(req)
  res.send(`Récupérer les articles paginés à partir de la page ${req.params.page} avec ${req.params.articlesPerPage} articles par page`)
})

// route permetant de récupérer un article
// par son id
router.get('/:id', async (req,res) => {
  utils.logRequest(req)
  res.send(`Récupérer l'article dont l'id est: ${req.params.id}`)
})

// route permetant de modifier un article
router.patch('/update/:id', async (req,res) => {
  utils.logRequest(req)
  res.send(`Modifier l'article dont l'id est: ${req.params.id}`)
})

// route permetant de supprimer un article
router.delete('/delete/:id', async (req,res) => {
  utils.logRequest(req)
  res.send(`Supprimer l'article dont l'id est: ${req.params.id}`)
})

module.exports = router