'use strict'; 

const User = require('../../models/user'); 

function findUser(twilioNumberCalled){ 
  return User.find({ 'twilio.phones[0].number': twilioNumberCalled })
    .then(([user]) => { 
      console.log('USER in FINDUSER() => ', user);
      return user; 
    }); 
}

module.exports = findUser; 