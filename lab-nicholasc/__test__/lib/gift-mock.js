'use strict';

const faker = require('faker');
const christmasListMock = require('./christmas-list-mock');
const Gift = require('../../model/gift');

const giftMock = module.exports = {};

giftMock.create = () => {
  let mock = {};

  return christmasListMock.create()
    .then(christmasList =>{
      mock.christmasList = christmasList;

      return new Gift({
        name : faker.name.findName(),
        description : faker.lorem.words(10),
        christmasList : christmasList._id,
      }).save();
    })
    .then(gift => {
      mock.gift = gift;
      return mock;
    });
};
giftMock.createMany = (howMany) => {
  let mock = {};
  
  return christmasListMock.create()
    .then(christmasList => {
      mock.christmasList = christmasList;
      return Promise.all(new Array(howMany)
        .fill(0)
        .map(() => {
          return new Gift({
            name : faker.name.findName(),
            description : faker.lorem.words(10),
            christmasList : christmasList._id,
          }).save();
        }));
    })
    .then(gifts =>{
      mock.gifts = gifts;
      return mock;
    });
};

giftMock.remove = () => Promise.all([
  Gift.remove({}),
  christmasListMock.remove(),
]);
