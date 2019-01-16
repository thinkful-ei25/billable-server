'use strict'; 
const express = require('express'); 
const router = express.Router(); 
const { CLIENT } = require('../config'); 
const User = require('../models/user'); 
const validateUser = require('../utils/validateUser'); 

//See Twilio status
router.get('/user', (req, res) => { 
  console.log('GET A PRE-EXISTING SUBACCOUNT / USER'); 

  // const { id } = req.body.id; 
  let tempId = '5c3fae2b152d093f16f1e236'; 
  return User.findById( tempId )
    .then(account => {
      let sid = account.twilio.sid; 
      console.log('sid', sid); 
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
}); 

router.delete('/user', (req, res) => { 
  //TODO
}); 

router.put('/user', (req, res) => { 
  //TODO
}); 

module.exports = router; 