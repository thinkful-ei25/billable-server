'use strict'; 

const mongoose = require('mongoose'); 

const ClientSchema = mongoose.Schema({
  userId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  company: {
    type:String, 
    required:true
  },
  firstName:{
    type:String,
    required:true
  },
  lastName:{
    type:String,
    required:true
  },
  category: String,
  hourlyRate:Number,
  email: String,
  photo: String,
  address: {
    streetOne: String,
    streetTwo: String,
    city: String,
    state: String,
    zip: Number
  },
  billable: Boolean,
  phoneNumber:{
    type:String,
    required:true
  },
  invoice:[ 
    {
      month:Number, 
      year:Number, 
      paid:Boolean
    }
  ],
  // calls: [{type: mongoose.Schema.Types.ObjectId, ref: 'Call'}],
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