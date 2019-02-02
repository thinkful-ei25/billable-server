'use strict'; 
// const {defaultImg} = require('../utils/constants');
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
  email: { 
    type: String,
    required: true
  },
  photo: { type: String },
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
      sentDate: { type: Date, required: true },
      month:Number, 
      amount: Number,
      year:Number, 
      paid:Boolean,
      paidDate: Date,
      invoiceId: String
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