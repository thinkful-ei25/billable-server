'use strict'; 

const express = require('express'); 
const router = express.Router(); 
const { CLIENT } = require('../config'); 
const User = require('../models/user'); 

router.post('/users', (req, res, next) => { 
  console.log('CREATE A NEW USER'); 
  const requiredFields = ['organizationName', 'email', 'hourlyRate', 'password']; 
  const missingField = requiredFields.find(field => !(field in req.body)); 

  if (missingField ) { 
    const err = new Error(`Missing '${missingField} in request body`); 
    err.status = 422; 
    return next(err); 
  }

  const stringFields = ['organizationName', 'password', 'email']; 
  const nonStringField = stringFields.find(field => !(field in req.body)); 

  if (nonStringField) { 
    const err = new Error(`Field: '${nonStringField}' must be type String`); 
    err.status = 422; 
    return next(err); 
  }

  const explicityTrimmedFields = ['organizationName', 'password', 'email'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    const err = new Error(`Field: '${nonTrimmedField}' cannot start or end with whitespace`);
    err.status = 422;
    return next(err);
  }

  const sizedFields = {
    organizationName: { min: 1 },
    password: { min: 8, max: 72 }
  };

  const tooSmallField = Object.keys(sizedFields).find(
    field => 'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  if (tooSmallField) {
    const min = sizedFields[tooSmallField].min;
    const err = new Error(`Field: '${tooSmallField}' must be at least ${min} characters long`);
    err.status = 422;
    return next(err);
  }

  const tooLargeField = Object.keys(sizedFields).find(
    field => 'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooLargeField) {
    const max = sizedFields[tooLargeField].max;
    const err = new Error(`Field: '${tooLargeField}' must be at most ${max} characters long`);
    err.status = 422;
    return next(err);
  }

  let { organizationName, password, globalHourlyRate, email } = req.body; 
  let sid; 

  return CLIENT.api.accounts
    .create({friendlyName: 'Brady Fox'})
    .then(account => { 
      sid = account.sid;  
      return User.hashPassword(password);  
    })
    .then(digest => { 
      const newUser = { 
        organizationName, 
        password: digest, 
        sid, 
        globalHourlyRate, 
        email
      }; 
      return User.create(newUser); 
    })
    .then(newUser => { 
      res
        .status(201)
        .location(`/api/users/${result.id}`).json(result) 
        .end(); 
    })
    .catch((err) => { 
      if (err.code === 11000) { 
        err = new Error('The username already exists'); 
        err.status = 400; 
      }
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