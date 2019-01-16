'use strict'; 

const mongoose = require('mongoose'); 

const ClientSchema = mongoose.Schema({
  userId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  clientId:mongoose.Schema.Types.ObjectId,
  company: {
    type:String, 
    required:true
  },
  hourlyRate:Number,
  phoneNumber:String,
  invoice:[
    {
      month:Number, 
      year:Number, 
      paid:Boolean
    }
  ]
}); 

ClientSchema.set('toJSON', {
  virtuals: true, 
  transform: (doc, result) => {
    delete result._id; 
    delete result.__v; 
  }
}); 

const Client = mongoose.model('Client', ClientSchema); 

module.exports = Client; 