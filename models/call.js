'use strict'; 

const mongoose = require('mongoose'); 

const CallSchema = mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Client'
  }, 
  start:String, 
  end:String, 
  phoneNumber: {type:String, required:true}, 
  rating: Number, 
  billable: Number
}); 

CallSchema.set('toJSON', {
  virtuals: true, 
  transform: (doc, result) => {
    delete result._id; 
    delete result.__v; 
  }
}); 

const Call = mongoose.model('Call', CallSchema);

module.exports = Call; 