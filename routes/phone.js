'use strict'; 

const express = require('express'); 
const router = express.Router(); 

const createClient = require('../utils/createClient'); 

router.post('/', (req, res) => { 
  const subAccount = createClient(req.user.email); 
  console.log('CREATE A NEW PHONE NUMBER'); 
  console.log('number', number); 

  ///////////START HERE
  createClient(req.user.email)
    .then(client => { 
      return client.incomingPhoneNumbers.create({ 
        phoneNumber: req.user.twilio.phones.number
      }); 
    })
    .then(createdPhoneNumber => { 
      console.log('phone', createdPhoneNumber); 
      res.end(); 
    })
    .catch(err => { 
      console.log('POST /api/phone', error); 
    }); 
}); 

router.put('/phone', (req, res) => { 
  console.log('UPDATE A PREXISTING PHONE NUMBER'); 

}); 

module.exports = router; 