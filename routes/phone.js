'use strict'; 

const express = require('express'); 
const router = express.Router(); 
const User = require('../models/user'); 
const { MASTER_CLIENT, BASE_URL } = require('../config'); 
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

      //FOR DEV
      // return client.incomingPhoneNumbers.create({ 
      //FOR TESTING (make sure client config is set to testing)
      return client.incomingPhoneNumbers.create({ 
        phoneNumber: twilioPhoneNumber, 
        friendlyName: twilioPhoneNumberName, 
        voiceMethod: 'POST', 
        voiceUrl: `${BASE_URL}/call/inbound`
      }); 
    })
    .then(createdPhone => { 
      twilioPhone = createdPhone; 
      return User.findOne({ organizationName });
    })
    .then(user => { 
      user.organizationPhoneNumber = organizationPhoneNumber; 
      const phone = {phoneFriendlyName: twilioPhone.friendlyName, number: twilioPhone.phoneNumber }; 

      user.twilio.phones.push(phone); 
      user.save(); 
      
      res
        .status(201)
        .json({message: 'A phone was created'})
        .end(); 
    })
    .catch(err => { 
      console.log('POST /api/phone', err); 
    }); 
}); 

router.put('/', (req, res) => { 
  console.log('UPDATE A PREXISTING PHONE'); 

}); 

module.exports = router; 