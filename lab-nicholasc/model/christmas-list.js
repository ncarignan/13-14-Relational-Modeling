'use strict';

const mongoose = require('mongoose');

const christmasListSchema = mongoose.Schema({
  name : {
    type : String,
    required : true,
    unique : true,
  },
  list : {
    type : String,
    required : true,
    minlength : 10,
  },
  pricelimit : {
    type : Number,
    required : true,
  },
  secretsanta: {
    type : String,
    required : true,
    unique : true,
  },
});


//this becomes recipes
module.exports = mongoose.model('christmasList', christmasListSchema);
