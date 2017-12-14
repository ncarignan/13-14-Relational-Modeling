'use strict';

const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  title : {
    type : String,
    required : true,
    unique : true,
  },
  content : {
    type : String,
    required : true,  
    minlength : 10,
  },
  timestamp : {
    type : Date,
    default : () => new Date(),
  },
});


//this becomes recipes
module.exports = mongoose.model('recipe', recipeSchema);
