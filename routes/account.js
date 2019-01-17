'use strict'; 
const express = require('express'); 
const router = express.Router(); 
const { CLIENT } = require('../config'); 
const User = require('../models/user'); 
const validateUser = require('../utils/validateUser'); 

router.get('/user', (req, res) => { 
  console.log('GET A PRE-EXISTING SUBACCOUNT / USER'); 
  const { sid } = req.user.twilio;

  //TODO: ERROR CHECK
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

//NOT MVP
router.delete('/user', (req, res) => { 
  //TODO
}); 

//NOTED: can update user status (active, suspended)
router.put('/user/:status', (req, res, next) => { 
  const { status } = req.params; 
  const {twilio , email} = req.user; 

  //TODO ERROR CHECK

  Promise.all([updateTwilioAccountPromise(twilio.sid, status), updateDbAccountPromise(email, status)])
    .then((result) => { 
      res
        .status(201)
        .json(result[1]); 
    })
    .catch(err => { 
      console.log('err', err); 
    }); 
}); 

const updateTwilioAccountPromise = (sid, status) =>  { 
  return CLIENT.api.accounts(sid).update({status})
    .then(account => { 
      // console.log('friendly name', account.friendlyName); 
    })
    .catch(err => { 
      console.log('err', err)
    })
    .done(); 
}; 

const updateDbAccountPromise = (email, status) => {  
  return User.findOne({email})
    .then((account) => { 
      account.twilio.status = status; 
      account.save(); 
      return account; 
    })
    .catch(err => { 
      console.log('err', err); 
    }); 
}; 

module.exports = router; 