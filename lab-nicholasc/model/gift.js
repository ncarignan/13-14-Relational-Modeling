'use strict';

const mongoose = require('mongoose');
const ChristmasList = require('./christmas-list');
const httpErrors = require('http-errors');


const giftSchema = mongoose.Schema({
  name : {
    type : String,
    required : true,
    unique : true,
  },
  description : {
    type : String,
    required : true,
    minlength : 10,
  },
  timestamp : {
    type : Date,
    default : () => new Date(),
  },
  christmasList : {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref : 'christmasList',
  },
});
//-----------------
//Setting up relationship management
//------------
giftSchema.pre('save', function(done){//we need access to contextual this
  return ChristmasList.findById(this.christmasList)
    .then(christmasListFound =>{
      if(!christmasListFound)
        throw httpErrors(404, 'christmasList not found');

      christmasListFound.gifts.push(this._id);
      return christmasListFound.save();
    })
    .then(() => done()) // a lot of assumptions here
    .catch(done); //this will trigger an error
});
giftSchema.post('remove', (document, done) =>{//document is the note i just removed
  return ChristmasList.findById(document.christmasList)
    .then(christmasListFound =>{
      if(!christmasListFound)
        throw httpErrors(404, 'christmasList not found');

      christmasListFound.notes = christmasListFound.notes.filter(gift => {
        return gift._id.toString() !== document._id.toString();
      });
      return christmasListFound.save();
    })
    .then(() => done())
    .catch(done);
});
//-----------

module.exports = mongoose.model('gift', giftSchema);//becomes gifts
