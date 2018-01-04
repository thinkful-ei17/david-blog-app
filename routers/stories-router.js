'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

var data = require('../db/dummy-data');

const { DATABASE } = require('../config');
const knex = require('knex')(DATABASE);

router.use(bodyParser.json());

/* ========== GET/READ ALL ITEMS ========== */
router.get('/stories', (req, res, next) => {
  knex('stories')
    .select('id', 'title', 'content')
    .orderBy('id')
    .then(results => res.json(results))
    .catch(next);
});

/* ========== GET/READ SINGLE ITEMS ========== */
router.get('/stories/:id', (req, res, next) => {
  knex('stories')
    .select('id', 'title', 'content')
    .where('id', req.params.id)
    .then(results => {
      if (results.length === 0) {
        next();
      } else {
        res.json(results[0]);
      }
    })
    .catch(next);
});

/* ========== POST/CREATE ITEM ========== */
router.post('/stories', (req, res, next) => {
  const required = ['title'];
  
  required.forEach(requiredField => {
    if (!(requiredField in req.body)) {
      const errorMessage = `You're missing a required field: ${requiredField}`;
      console.error(errorMessage);
      res.status(400).end();
      return;
    }
  });

  knex('stories')
    .insert({
      title: req.body.title, 
      content: req.body.content
    })
    .returning(['id', 'title', 'content'])    
    .then(results => res.location(`/stories/${results.id}`).status(201).json(results[0]))
    .catch(next);
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/stories/:id', (req, res, next) => {
  
  const required = ['id', 'title'];
  
  required.forEach(requiredField => {
    if (!(requiredField in req.body)) {
      const errorMessage = `You're missing a required field: ${requiredField}`;
      console.error(errorMessage);
      return res.status(400).send(errorMessage);
    }
  });

  if (parseInt(req.params.id) !== req.body.id) {
    const errorMessage = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(errorMessage);
    return res.status(400).send(errorMessage);
  }

  knex('stories')
    .where('id', req.params.id)
    .update({
      title: req.body.title,
      content: req.body.content
    })
    .returning(['id', 'title', 'content'])
    .then(results => {
      if (results.length === 0) {
        const errorMessage = `Id ${req.params.id} does not exist`;
        return res.status(404).send(errorMessage);
      } else {
        res.json(results[0]);
      }
    })
    .catch(next);
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/stories/:id', (req, res, next) => {
  knex('stories')
    .where('id', req.params.id)
    .del()
    .then(res.status(204).end())
    .catch(next);
});

module.exports = router;