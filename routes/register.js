'use strict'; 

const express = require('express'); 
const router = express.Router(); 
const { MASTER_CLIENT } = require('../config'); 
const User = require('../models/user'); 
const validateUser = require('../utils/validators/user.validate'); 

router.post('/user', (req, res, next) => { 
  console.log('CREATE A NEW USER'); 
  let account, password, user; 

  validateUser(req, res)
    .then((validatedUser) => {
      user = validatedUser; 
      password = user.password; 
      return MASTER_CLIENT.api.accounts
        .create({friendlyName: user.organizationName}); 
    })
    .then(createdAccount => { 
      account = createdAccount;   
      return User.hashPassword(password);  
    })
    .then(digest => { 
      const newUser = { 
        organizationName : user.organizationName, 
        password: digest, 
        globalHourlyRate: user.hourlyRate, 
        email : user.email, 
        twilio: { 
          sid: account.sid, 
          authToken : account.authToken, 
          accountFriendlyName : account.friendlyName
        }
      }; 
      return User.create(newUser); 
    })
    .then(newUser => { 
      res
        .status(201)
        .location(`/api/users/${newUser.id}`).json(newUser) 
        .end(); 
    })
    .catch((err) => { 
      if (err.code === 11000) { 
        err = new Error('The organization name already exists'); 
        err.status = 400; 
      }
      err.status = 404; 
      next(err); 
    }); 
}); 

router.get('/phones', (req, res) => { 
  console.log('FIND AVAILABLE LOCAL PHONE NUMBERS'); 
  const { areaCode } = req.body; 

  MASTER_CLIENT
    .availablePhoneNumbers('US')
    .local.list({
      areaCode 
    })
    .then(availableNumbers => {
      const subsetAvailableNumbers = availableNumbers.slice(0, 5); 
      let phoneNumbers = []; 
      subsetAvailableNumbers.forEach((number) => { 
        phoneNumbers.push(number.phoneNumber); 
      });

      res
        .json(phoneNumbers)
        .done(); 
    }); 
}); 

module.exports = router; 