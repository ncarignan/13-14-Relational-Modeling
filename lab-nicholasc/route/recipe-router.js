'use strict';

const {Router} = require('express');

const jsonParser = require('body-parser').json();

const Recipe = require('../model/recipe');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');

const recipeRouter = module.exports = new Router();

recipeRouter.post('/api/recipes', jsonParser, (request, response, next) => {
  logger.log('info', 'POST - processing request');

  if(!request.body.title || !request.body.content) {
    return next(httpErrors(400, 'body and title must be defined'));
  }
  return new Recipe(request.body).save()
    .then(recipe => {
      logger.log('info', 'responding with a status of 200- sending recipe');
      response.json(recipe);
    })
    .catch(next);
});
recipeRouter.get('/api/recipes/', (request, response, next) => {
  const PAGE_SIZE = 10;
  let {page = '0'} = request.query;
  page - Number(page);
  if(isNaN(page))
    page = 0;
  page = page < 0 ? 0 : page;
  let allRecipes = null;

  return Recipe.find({})
    .skip(page * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .then(recipes => {
      allRecipes = recipes;
      return Recipe.find({}).count();
    })
    .then(recipeCount => {
      let responseData = {
        count : recipeCount,
        data : allRecipes,
      };
      let lastPage = Math.floor(recipeCount / PAGE_SIZE);
      response.links({
        next : `http://localhost:${process.env.PORT}/api/notes?page=${page === lastPage ? lastPage : page +1}`,
        prev : `http://localhost:${process.env.PORT}/api/notes?page=${page < 1 ? 0 : page -1}`,
        last : `http://localhost:${process.env.PORT}/api/notes?page=${lastPage}`,
      });
      response.json(responseData);
    })
    .catch(next);
});
recipeRouter.get('/api/recipes/:id', (request, response, next) => {
  logger.log('info', 'GET - processing a request');
  return Recipe.findById(request.params.id)
    .then(recipe => {
      if(!recipe){
        throw httpErrors(404, 'recipe not found');
      }
      logger.log('info', 'GET - returning a 200 status code');
      return response.json(recipe);
    }).catch(next);
});

recipeRouter.delete('/api/recipes/:id', (request, response, next) => {
  return Recipe.findByIdAndRemove(request.params.id)
    .then(recipe => {
      if(!recipe){
        throw httpErrors(404, 'recipe not found');
      }
      logger.log('info', 'DELETE - returning a 204 status code');
      return response.sendStatus(204);
    }).catch(next);

});
recipeRouter.put('/api/recipes/:id', jsonParser, (request, response, next) => {
  //this configures mongos update
  let options = {runValidators : true, new : true};
  return Recipe.findByIdAndUpdate(request.params.id, request.body, options)
    .then(recipe => {
      if(!recipe){
        throw httpErrors(404, 'recipe not found');
      }
      logger.log('info', 'Put - returning a 200 status code');
      return response.json(recipe);
    }).catch(next);

});
