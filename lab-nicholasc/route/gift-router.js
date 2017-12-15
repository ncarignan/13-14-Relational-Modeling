'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const Gift = require('../model/gift');

const logger = require('../lib/logger');
const httpErrors = require('http-errors');

const giftRouter = module.exports = new Router();

giftRouter.post('/api/gifts', jsonParser, (request, response, next) => {
  logger.log('info', 'POST - processing request');
  if(!request.body.name) {
    return next(httpErrors(400, 'name must be defined'));
  }
  return new Gift(request.body).save()
    .then(gift => {
      logger.log('info', 'responding with a status of 200- sending gift');
      response.json(gift);
    })
    .catch(error => next(error));
});

giftRouter.get('/api/gifts', (request, response, next) => {
  const PAGE_SIZE = 10;
  let {page = '0'} = request.query;
  page = Number(page);
  if(isNaN(page))
    page = 0;
  page = page < 0 ? 0 : page;
  let allGifts = null;

  return Gift.find({})
    .skip(page * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .then(gifts => {
      allGifts = gifts;
      return Gift.find({}).count();
    })
    .then(giftCount => {
      let responseData = {
        count : giftCount,
        data : allGifts,
      };
      let lastPage = Math.floor(giftCount / PAGE_SIZE);
      response.links({
        next : `http://localhost:${process.env.PORT}/api/notes?page=${page === lastPage ? lastPage : page +1}`,
        prev : `http://localhost:${process.env.PORT}/api/notes?page=${page < 1 ? 0 : page -1}`,
        last : `http://localhost:${process.env.PORT}/api/notes?page=${lastPage}`,
      });
      response.json(responseData);
    })
    .catch(next);
});

giftRouter.get('/api/gifts/:id', (request, response, next) => {
  logger.log('info', 'GET - processing a request');
  return Gift.findById(request.params.id)
    .then(christmasList => {
      if(!christmasList){
        throw httpErrors(404, 'christmasList not found');
      }
      logger.log('info', 'GET - returning a 200 status code');
      return response.json(christmasList);
    }).catch(next);
});
giftRouter.get('/api/gifts/:id', (request, response, next) => {
  logger.log('info', 'GET - processing a request');
  return Gift.findById(request.params.id)
    .populate('christmasList')
    .then(gift => {
      if(!gift){
        throw httpErrors(404, 'gift not found');
      }
      logger.log('info', 'GET - returning a 200 status code');
      return response.json(gift);
    }).catch(next);
});

giftRouter.delete('/api/gifts/:id', (request, response, next) => {
  return Gift.findByIdAndRemove(request.params.id)
    .then(gift => {
      if(!gift){
        throw httpErrors(404, 'gift not found');
      }
      logger.log('info', 'DELETE - returning a 204 status code');
      return response.sendStatus(204);
    }).catch(next);

});
giftRouter.put('/api/gifts/:id', jsonParser, (request, response, next) => {
  //this configures mongos update
  let options = {runValidators : true, new : true};
  return Gift.findByIdAndUpdate(request.params.id, request.body, options)
    .then(gift => {
      if(!gift){
        throw httpErrors(404, 'gift not found');
      }
      logger.log('info', 'Put - returning a 200 status code');
      return response.json(gift);
    }).catch(next);

});
