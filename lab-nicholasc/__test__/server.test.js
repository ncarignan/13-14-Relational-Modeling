'use strict';

process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Recipe = require('../model/recipe');
const ChristmasList = require('../model/christmas-list');
const server = require('../lib/server');

const apiURL = `http://localhost:${process.env.PORT}/api`;

const recipeMockCreate = () => {
  return new Recipe({
    title : faker.lorem.words(10),
    content : faker.lorem.words(100),
  }).save();
};

const recipeMockCreateMany = (howMany) => {
  return Promise.all(new Array(howMany)
    .fill(0)
    .map(() => {
      recipeMockCreate();
    }));
};

const christmasListMockCreate = () => {
  return new ChristmasList({
    name : faker.name.findName(),
    list : faker.lorem.words(100),
    pricelimit : faker.lorem.words(100),
    secretsanta : faker.name.findName(),
  }).save();
};

const recipeMockCreateMany = (howMany) => {
  return Promise.all(new Array(howMany)
    .fill(0)
    .map(() => {
      christmasListMockCreate();
    }));
};

describe('/api/recipes', () => {
  beforeAll(server.start);
  afterEach(() => Recipe.remove({})); //if we rmove after all, hopefullly sync wont break but if we do after each we have cleaner tests
  afterAll(server.stop);

  describe('POST /api/recipes', () => {
    test('should respond with a recipe and 200 status code if there is no error',
      () =>{
        let recipeToPost = {
          title : faker.lorem.words(10),
          content : faker.lorem.words(100),
        };
        return superagent.post(`${apiURL}/recipes`)
          .send(recipeToPost)
          .then(response => {
            expect(response.status).toEqual(200);
          });
      });
  });
  describe('GET /api/recipes', () => {
    test('should return 10 notes where 10 is the size of the page by default if there is no error', () =>{
      return recipeMockCreateMany(100)
        .then(() =>{
          return superagent.get(`${apiURL}/recipes`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.count).toEqual(100);
          expect(response.body.data.length).toEqual(10);
        });

    });
  });
  describe('GET /api/recipe:id', () => {
    test('should respond with recipes and 200 status code if there is no error', () =>{
      recipeMockCreate()
        .then(recipe => {
          return superagent.get(`${apiURL}/recipes/${recipe.id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
        });
    });
  });
  describe('PUT /api/recipes:id', () => {
    test('should update and respond with 200 status code if there is no error', () =>{
      let recipeToUpdate = null;

      return recipeMockCreate()
        .then(recipe => {
          recipeToUpdate = recipe;
          return superagent.put(`${apiURL}/recipes/${recipe.id}`)
            .send({title : 'grilled cheese'});
        })
        .then(response => {//only access to response but we want to test original
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('grilled cheese');
          expect(response.body.content).toEqual(recipeToUpdate.content);
          expect(response.body._id).toEqual(recipeToUpdate.id.toString());
        });
    });
    test('should respond with a 404 error code if id invalid', () =>{
      return superagent.delete(`${apiURL}/recipes/`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
  describe('DELETE /api/recipes:id', () => {
    test('should respond with 204 status code if there is no error', () =>{
      return recipeMockCreate()
        .then(recipe => {
          return superagent.delete(`${apiURL}/recipes/${recipe.id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });
    test('should respond with a 404 error code if id invalid', () =>{
      return superagent.delete(`${apiURL}/recipes/`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});

describe('/api/christmas-list', () => {
  beforeAll(server.start);
  afterEach(() => ChristmasList.remove({})); //if we rmove after all, hopefullly sync wont break but if we do after each we have cleaner tests
  afterAll(server.stop);

  describe('POST /api/recipes', () => {
    test('should respond with a recipe and 200 status code if there is no error',
      () =>{
        let recipeToPost = {
          title : faker.lorem.words(10),
          content : faker.lorem.words(100),
        };
        return superagent.post(`${apiURL}/christmas-lists`)
          .send(recipeToPost)
          .then(response => {
            expect(response.status).toEqual(200);
          });
      });
  });
  describe('GET /api/christmas-lists', () => {
    test('should return 10 notes where 10 is the size of the page by default if there is no error', () =>{
      return christmasListMockCreateMany(100)
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
  describe('GET /api/recipe:id', () => {
    test('should respond with recipes and 200 status code if there is no error', () =>{
      christmasListMockCreate()
        .then(recipe => {
          return superagent.get(`${apiURL}/christmas-lists/${recipe.id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
        });
    });
  });
  describe('PUT /api/christmas-lists:id', () => {
    test('should update and respond with 200 status code if there is no error', () =>{
      let recipeToUpdate = null;

      return christmasListMockCreate()
        .then(recipe => {
          recipeToUpdate = recipe;
          return superagent.put(`${apiURL}/christmas-lists/${recipe.id}`)
            .send({title : 'grilled cheese'});
        })
        .then(response => {//only access to response but we want to test original
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('grilled cheese');
          expect(response.body.content).toEqual(recipeToUpdate.content);
          expect(response.body._id).toEqual(recipeToUpdate.id.toString());
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
        .then(recipe => {
          return superagent.delete(`${apiURL}/christmas-lists/${recipe.id}`);
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
