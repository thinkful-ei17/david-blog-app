'use strict';

const express = require('express');
const router = express.Router();

var data = require('../db/dummy-data');

const { DATABASE } = require('../config');
const knex = require('knex')(DATABASE);

/* ========== GET/READ ALL ITEMS ========== */
router.get('/stories', (req, res, next) => {
  knex('stories')
    .select('id', 'title', 'content')
    .then(results => res.json(results))
    .catch(next);
});

/* ========== GET/READ SINGLE ITEMS ========== */
router.get('/stories/:id', (req, res, next) => {
  knex('stories')
    .select('id', 'title', 'content')
    .where('id', req.params.id)
    .then(result => res.json(result))
    .catch(next);
});

/* ========== POST/CREATE ITEM ========== */
router.post('/stories', (req, res) => {
  const {title, content} = req.body;
  
  /***** Never Trust Users! *****/  
  const newItem = {
    id: data.nextVal++,
    title: title,
    content: content
  };
  data.push(newItem);

  res.location(`${req.originalUrl}/${newItem.id}`).status(201).json(newItem);
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/stories/:id', (req, res) => {
  const {title, content} = req.body;
  
  /***** Never Trust Users! *****/
  
  const id = Number(req.params.id);
  const item = data.find((obj) => obj.id === id);
  Object.assign(item, {title, content});
  res.json(item);
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/stories/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = data.findIndex((obj) => obj.id === id);
  data.splice(index, 1);
  res.status(204).end();
});

module.exports = router;