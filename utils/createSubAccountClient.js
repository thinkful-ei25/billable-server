'use strict'; 
const User = require('../models/user'); 

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