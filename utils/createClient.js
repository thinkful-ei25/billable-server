'use strict'; 
const User = require('../models/user'); 

function createClient(userIdentifier){ 
  //NOTE CHANGE THIS
  return new Promise((res, rej) => { 
    User.findOne({email: userIdentifier})
      .then((user) => { 
        res(user.createClient()); 
      })
      .catch(err => { 
        rej(console.error('err', err));
      }); 
    }); 
}

module.exports = createClient; 