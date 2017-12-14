'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const ChristmasList = require('../model/christmas-list');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');

const christmasListRouter = module.exports = new Router();

christmasListRouter.post('/api/christmas-lists', jsonParser, (request, response, next) => {
  logger.log('info', 'POST - processing request');
  if(!request.body.name || !request.body.list || !request.body.pricelimit || !request.body.secretsanta) {
    return next(httpErrors(400, 'name, list, pricelimit, and secretsanta to be defined'));
  }
  return new ChristmasList(request.body).save()
    .then(christmasList => {
      logger.log('info', 'responding with a status of 200- sending christmasList');
      return response.json(christmasList);
    })
    .catch(next);
});//post matches 12/14 lecture format

christmasListRouter.put('/api/christmas-lists/:id', jsonParser, (request, response, next) => {
  let options = {runValidators : true, new : true};
  return ChristmasList.findByIdAndUpdate(request.params.id, request.body, options)
    .then(christmasList => {
      if(!christmasList){
        throw httpErrors(404, 'christmasList not found');
      }
      logger.log('info', 'Put - returning a 200 status code');
      return response.json(christmasList);
    }).catch(next);
}); // this matches 12/14 lecture format

christmasListRouter.get('/api/christmas-lists/:id', (request, response, next) => {
  logger.log('info', 'GET - processing a request');
  return ChristmasList.findById(request.params.id)
    .then(christmasList => {
      if(!christmasList){
        throw httpErrors(404, 'christmasList not found');
      }
      logger.log('info', 'GET - returning a 200 status code');
      return response.json(christmasList);
    }).catch(next);
});

christmasListRouter.delete('/api/christmas-lists/:id', (request, response, next) => {
  return ChristmasList.findByIdAndRemove(request.params.id)
    .then(christmasList => {
      if(!christmasList){
        throw httpErrors(404, 'christmasList not found');
      }
      logger.log('info', 'DELETE - returning a 204 status code');
      return response.sendStatus(204);
    }).catch(next);
});

christmasListRouter.get('/api/christmas-lists/', (request, response, next) => {
  const PAGE_SIZE = 10;
  let {page = '0'} = request.query;
  page - Number(page);
  if(isNaN(page))
    page = 0;
  page = page < 0 ? 0 : page;
  let allChristmasLists = null;

  return ChristmasList.find({})
    .skip(page * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .then(christmasLists => {
      allChristmasLists = christmasLists;
      return ChristmasList.find({}).count();
    })
    .then(christmasListCount => {
      let responseData = {
        count : christmasListCount,
        data : allChristmasLists,
      };
      let lastPage = Math.floor(christmasListCount / PAGE_SIZE);
      response.links({
        next : `http://localhost:${process.env.PORT}/api/notes?page=${page === lastPage ? lastPage : page +1}`,
        prev : `http://localhost:${process.env.PORT}/api/notes?page=${page < 1 ? 0 : page -1}`,
        last : `http://localhost:${process.env.PORT}/api/notes?page=${lastPage}`,
      });
      response.json(responseData);
    })
    .catch(next);
});
