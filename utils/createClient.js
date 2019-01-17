'use strict'; 
const User = require('../models/user'); 

function createClient(userIdentifier){ 
  //NOTE CHANGE THIS
  console.log('iden', userIdentifier); 
  return new Promise((res, rej) => { 
    User.findOne({email: userIdentifier})
      .then((user) => { 
        console.log('user', user.email); 
        res(user.createClient()); 
      })
      .catch(err => { 
        rej(console.error('err', err));
      }); 
    }); 
}

module.exports = createClient; 