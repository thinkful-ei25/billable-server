'use strict'; 

const express = require('express'); 
const router = express.Router(); 
const { CLIENT } = require('../config'); 
const User = require('../models/user'); 
// const validateUser = require('../utils/validateUser'); 
const createClient = require('../utils/createClient'); 

router.post('/', (req, res) => { 
  const subAccount = createClient(req.user.email); 
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
}); 

router.put('/phone', (req, res) => { 
  console.log('UPDATE A PREXISTING PHONE NUMBER'); 

}); 

module.exports = router; 