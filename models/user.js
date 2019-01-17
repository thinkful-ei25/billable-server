'use strict'; 

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose'); 
const twilio = require('twilio'); 

mongoose.Promise = global.Promise; 

const UserSchema = mongoose.Schema({
  id:{type:mongoose.Schema.Types.ObjectId},
  email:{
    type:String,
    required:true,
    unique:true
  },
  organizationName:{type:String, required:true},
  organizationPhoneNumber:String,
  globalHourlyRate:Number,
  password:{type:String, required: true}, 
  twilio: {
    authToken:{type:String, required:true}, 
    dateCreated:{type:Date},
    dateUpdated:{type:Date}, 
    accountFriendlyName:{type:String, required:true}, 
    sid:{type:String},
    status:{type:String, default: 'active'},
    phones:[{
      phoneFriendlyName:String,
      number:String
    }]
  }
});

UserSchema.set('toJSON', {
  virtuals: true, 
  transform: (doc, result) => {
    delete result._id; 
    delete result.__v; 
  }
}); 

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.createClient = function() { 
  console.log('hi brady'); 
  return twilio(this.twilio.sid, this.twilio.authToken); 
}; 

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10); 
}; 

const User = mongoose.model('User', UserSchema);

module.exports = User; 

