'use strict'; 

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose'); 

mongoose.Promise = global.Promise; 

const UserSchema = mongoose.Schema({
  _id:{type:mongoose.Schema.Types.ObjectId},
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
    friendlyName:{type:String, required:true},
    sid:{type:String},
    status:{type:String},
    phones:[{
      sid:{
        friendlyName:{type:String}, number:Number }
    }]
  }
});


UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}; 

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10); 
}; 

const User = mongoose.model('User', UserSchema);

module.exports = {User}; 

