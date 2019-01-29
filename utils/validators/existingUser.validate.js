'use strict'; 

const User = require('../../models/user'); 

function isExistingUser(organizationName){ 
  return new Promise((res, rej) => { 
    User.findOne({ organizationName })
      .then((user) => { 

        //If that user already exists
        if (user){ 
          let err = new Error(`User with the name ${organizationName} already exists`); 
          err.status = 422; 
          rej(err);
        }
        else {
          res(); 
        }
      })
      .catch(err => { 
        console.error('err', err); 
      }); 
  }); 
}

module.exports = isExistingUser; 