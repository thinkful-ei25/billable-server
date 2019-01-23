'use strict'; 

const mongoose = require('mongoose'); 

const CallSchema = mongoose.Schema({
  id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Client'
  }, 
  start:String, 
  end:String, 
  duration: String,
  userPhoneNumber: {type:String, required:true},
  clientPhoneNumer: {type: String, required: true},
  callSid: String, 
  billable: Boolean,
  direction: String,
  status: String,
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