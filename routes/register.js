'use strict'; 

const express = require('express'); 
const router = express.Router(); 
const { CLIENT } = require('../config'); 
const User = require('../models/user'); 
const validateUser = require('../utils/validateUser'); 
// const hashPassword = require('../utils/hash-password'); 

router.post('/users', (req, res, next) => { 
  console.log('CREATE A NEW USER'); 
  let account, password, user; 

  validateUser(req, res)
    .then((validatedUser) => {
      user = validatedUser; 
      password = user.password; 
      return CLIENT.api.accounts.create({friendlyName: user.organizationName}); 
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
        err = new Error('The username already exists'); 
        err.status = 400; 
      }
      err.status = 404; 
      next(err); 
    }); 
}); 

router.get('/users', (req, res) => { 
  console.log('GET A PRE-EXISTING USER'); 
  const accountSid = 'AC5ad320be60c4f745deea8e44f06b8906'; 

  CLIENT.api.accounts(accountSid)
    .fetch()
    .then(account => { 
      console.log(account); 
      res.json(account); 
    })
    .done();
}); 

router.delete('/users', (req, res) => { 
  //TODO
}); 

router.put('/users', (req, res) => { 
  //TODO
}); 

router.get('/phone/search', (req, res) => { 
  console.log('FIND AVAILABLE LOCAL PHONE NUMBERS'); 
  const areaCode = '802'; 
  CLIENT
    .availablePhoneNumbers('US')
    .local.list({
      areaCode 
    })
    .then(availableNumbers => {
      console.log('availableNumbers', availableNumbers, 'length', availableNumbers.length);
      number = availableNumbers[0].phoneNumber;
      console.log('number', number); 
      res.json(number); 
    }); 
}); 

router.post('/phone', (req, res) => { 
  console.log('CREATE A NEW PHONE NUMBER'); 
  console.log('number', number); 
  CLIENT.incomingPhoneNumbers.create({
    phoneNumber: number,
  })
    .then(createdPhoneNumber => { 
      console.log('phone', createdPhoneNumber); 
      res.end(); 
    })
    .catch(err => { 
      console.log('POST /api/phone', error); 
    }); 
  //put phone number in to mongo and name of it
  //auth 
  //
}); 

router.put('/phone', (req, res) => { 
  console.log('UPDATE A PREXISTING PHONE NUMBER'); 

}); 




module.exports = router; 