const express = require('express'); 
const router = express.Router(); 
// const {TEST_TWILIO_ACCOUNT_SID,  TEST_TWILIO_AUTH_TOKEN} = require('../config'); 
// const client = require('twilio')(TEST_TWILIO_ACCOUNT_SID, TEST_TWILIO_AUTH_TOKEN);
const VoiceResponse = require('twilio').twiml.VoiceResponse; 

router.get('/', (req, res) => { 
  console.log('test'); 
  res.json('test worked'); 
}); 

router.post('/inbound', (req, res) => { 
  //phoneNumber will reference the database
  let phoneNumber = '+13019803889'; 
  
  //incoming caller
  let callerId = null; 

  let allowedCallers = []; 

  let twiMl = new VoiceResponse(); 
  
  //conditions to see if the incoming caller is allowed
  twiMl.dial(callerId, phoneNumber); 

  res
    .type('text/xml')
    .send(twiMl.toString())
    .end(); 
  
}); 

router.post('/outbound', (req, res) => { 

}); 

module.exports = router; 