'use strict'; 

const User = require('../../models/user'); 
const Client = require('../../models/client'); 

function findUser(twilioNumberCalled){ 
  return User.find({ 'twilio.phones.number': twilioNumberCalled })
    .then(([user]) => { 
      return user; 
    }); 
}

module.exports = findUser; 