'use strict';

process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Recipe = require('../model/recipe');
const ChristmasList = require('../model/christmas-list');
const server = require('../lib/server');

const apiURL = `http://localhost:${process.env.PORT}/api`;

describe('/api/christmas-lists', () => {
  beforeAll(server.start);
  afterEach(() => ChristmasList.remove({})); //if we rmove after all, hopefullly sync wont break but if we do after each we have cleaner tests
  afterAll(server.stop);

  describe('POST /api/christmas-lists', () => {
    test('should respond with a christmas list and 200 status code if there is no error',
      () =>{
        let christmasListToPost = {
          name : faker.name.findName(),
          list : faker.lorem.words(100),
          pricelimit : faker.random.number(100),
          secretsanta : faker.name.findName(),
        };
        console.log(christmasListToPost);
        return superagent.post(`${apiURL}/christmas-lists`)
          .send(christmasListToPost)
          .then(response => {
            expect(response.status).toEqual(200);
          });
      });
  });
  describe('GET /api/christmas-lists', () => {
    test('should return 10 christmas lists where 10 is the size of the page by default if there is no error', () =>{
      return noteMockCreateMany(100)
        .then(() =>{
          return superagent.get(`${apiURL}/christmas-lists`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.count).toEqual(100);
          expect(response.body.data.length).toEqual(10);
        });

    });
  });
  describe('GET /api/christmas-lists:id', () => {
    test('should respond with christmas lists and 200 status code if there is no error', () =>{
      christmasListMockCreate()
        .then(christmasList => {
          return superagent.get(`${apiURL}/christmas-lists/${christmasList.id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
        });
    });
  });
  describe('PUT /api/christmas-lists:id', () => {
    test('should update and respond with 200 status code if there is no error', () =>{
      let christmasListToUpdate = null;

      return christmasListMockCreate()
        .then(christmasList => {
          christmasListToUpdate = christmasList;
          return superagent.put(`${apiURL}/christmas-lists/${christmasList.id}`)
            .send({name : 'Nicholas Carignan'});
        })
        .then(response => {//only access to response but we want to test original
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual('Nicholas Carignan');
          expect(response.body.list).toEqual(christmasListToUpdate.list);
          expect(response.body.pricelimit).toEqual(christmasListToUpdate.pricelimit);
          expect(response.body._id).toEqual(christmasListToUpdate.id.toString());
        });
    });
    test('should respond with a 404 error code if id invalid', () =>{
      return superagent.delete(`${apiURL}/christmas-lists/`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
  describe('DELETE /api/christmas-lists:id', () => {
    test('should respond with 204 status code if there is no error', () =>{
      return christmasListMockCreate()
        .then(christmasList => {
          return superagent.delete(`${apiURL}/christmas-lists/${christmasList.id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });
    test('should respond with a 404 error code if id invalid', () =>{
      return superagent.delete(`${apiURL}/christmas-lists/`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
