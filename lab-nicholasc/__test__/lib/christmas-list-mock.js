'use strict';

const faker = require('faker');
const ChristmasList = require('../../model/christmas-list');

const christmasListMock = module.exports = {};

christmasListMock.create = () => {
  return new ChristmasList({
    name : faker.name.findName(),
    list : faker.lorem.words(5).split(' '),
    pricelimit : faker.random.number(100),
    secretsanta : faker.name.findName(),
  }).save();
};
christmasListMock.createMany = (howMany) => {
  return Promise.all(new Array(howMany).fill(0)
    .map(() => christmasListMock.create()));
};

christmasListMock.remove = () => ChristmasList.remove({});
