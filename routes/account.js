'use strict'; 
const express = require('express'); 
const router = express.Router(); 
const { CLIENT } = require('../config'); 
const User = require('../models/user'); 
const validateUser = require('../utils/validateUser'); 

//See Twilio status
router.get('/user', (req, res) => { 
  console.log('GET A PRE-EXISTING USER'); 
  const accountSid = 'AC5ad320be60c4f745deea8e44f06b8906'; 
  // return User.find({})
  CLIENT.api.accounts(accountSid)
    .fetch()
    .then(account => { 
      console.log(account); 
      res.json(account); 
    })
    .done();
}); 

router.delete('/user', (req, res) => { 
  //TODO
}); 

router.put('/user', (req, res) => { 
  //TODO
}); 

module.exports = router; 