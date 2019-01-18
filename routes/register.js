'use strict';

const express = require('express'); 
const router = express.Router(); 
const { MASTER_CLIENT } = require('../config'); 
const User = require('../models/user'); 
const validateUser = require('../utils/validators/user.validate'); 
const isExistingUser = require('../utils/validators/existingUser.validate'); 
const { PHONE_NUMBER_LIMIT } = require('../utils/constants'); 

router.post('/user', (req, res, next) => { 
  console.log('CREATE A NEW USER'); 
  const { organizationName } = req.body; 
  let account, password, user; 

  isExistingUser(organizationName)
    .then(() => { 
      return  validateUser(req, res); 
    })
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
        email : user.email, 
        twilio: { 
          sid: account.sid, 
          authToken : account.authToken, 
          accountFriendlyName : account.friendlyName, 
          dateCreated: account.dateCreated, 
          dateUpdated: account.dateUpdated, 
          status: account.status
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
        err = new Error('User with that email address already exists');
        err.status = 400;
        err.reason = 'ValidationError';
        next(err);
      }
      else (err.status = 404);
      next(err);
    });
});

router.get('/phones', (req, res) => { 
  console.log('FIND AVAILABLE PHONE NUMBERS'); 
  const { areaCode } = req.body; 

  MASTER_CLIENT
    .availablePhoneNumbers('US')
    .local.list({
      areaCode, 
      excludeAllAddressRequired: 'true',
      voiceEnabled: 'true'
    })
    .then(availableNumbers => {

      let phoneNumbers = []; 
      for (let i = 0; i < PHONE_NUMBER_LIMIT; i++) { 
        phoneNumbers.push(availableNumbers[i].phoneNumber); 
      }
  
      res
        .json(phoneNumbers)
        .done();
    });
});

module.exports = router; 