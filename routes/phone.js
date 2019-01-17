'use strict'; 

const express = require('express'); 
const router = express.Router(); 
const User = require('../models/user'); 

const createSubAccountClient = require('../utils/createSubAccountClient'); 

router.post('/', (req, res) => { 
  console.log('CREATE A NEW PHONE NUMBER'); 

  const { twilioPhoneNumber, organizationPhoneNumber, twilioPhoneNumberName } = req.body;  
  const {organizationName} = req.user; 
  //TODO: ERROR CHECK INCOMING DATA

  let twilioPhone; 

  createSubAccountClient(organizationName)
    .then(client => { 
      //Configured for phone calls (redirect to use inbound call route)
      return client.incomingPhoneNumbers.create({ 
        phoneNumber: twilioPhoneNumber, 
        friendlyName: twilioPhoneNumberName, 
        voiceMethod: 'POST', 
        voiceUrl: 'https://d28bf872.ngrok.io/api/call/inbound' 
      }); 
    })
    .then(createdPhone => { 
      console.log('phone', createdPhone); 
      twilioPhone = createdPhone; 
      return User.findOne({ organizationName });
    })
    .then(user => { 
      user.organizationPhoneNumber = organizationPhoneNumber; 
      user.twilio.phones.push(twilioPhone); 
      user.save(); 
    })
    .catch(err => { 
      console.log('POST /api/phone', error); 
    }); 
}); 

router.put('/', (req, res) => { 
  console.log('UPDATE A PREXISTING PHONE'); 

}); 

module.exports = router; 