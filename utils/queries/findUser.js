'use strict'; 

const User = require('../../models/user'); 

function findUser(twilioNumberCalled){ 
  return User.findOne({ 'twilio.phones.number': twilioNumberCalled })
    .then((user) => { 
      console.log('USER in FINDUSER() => ', user);
      return user; 
    }); 
}

module.exports = findUser; 