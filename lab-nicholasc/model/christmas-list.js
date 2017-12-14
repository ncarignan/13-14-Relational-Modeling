'use strict';

const mongoose = require('mongoose');

const christmasListSchema = mongoose.Schema({
  name : {
    type : String,
    required : true,
    unique : true,
  },
  list : [{type: String}],
  timestamp : {
    type : Date,
    default : () => new Date(),
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
  gifts : [{type : mongoose.Schema.Types.ObjectId,
    ref : 'gift'}],
},{
  usePushEach : true, //pushes them in element by element instead of all at once
});


//this becomes recipes
module.exports = mongoose.model('christmasList', christmasListSchema);
