'use strict'; 
const User = require('../models/user'); 
const ClientCapability = require('twilio').jwt.ClientCapability;



function createSubAccountClient(organizationName){ 
  return new Promise((res, rej) => { 
    User.findOne({organizationName})
      .then((user) => { 
        res(user.createClient()); 
      })
      .catch(err => { 
        rej(console.error('err', err));
      }); 
    }); 
}

module.exports = createSubAccountClient; 