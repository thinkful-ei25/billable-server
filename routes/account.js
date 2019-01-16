'use strict'; 
const express = require('express'); 
const router = express.Router(); 
const { CLIENT } = require('../config'); 
const User = require('../models/user'); 
const validateUser = require('../utils/validateUser'); 

router.get('/user', (req, res) => { 
  console.log('GET A PRE-EXISTING SUBACCOUNT / USER'); 
  const { sid } = req.user.twilio;

  CLIENT.api.accounts(sid)
  .fetch()
  .then(account => { 
    console.log(account); 
    res.json(account); 
  })
  .catch(err => { 
    console.log('err', err); 
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