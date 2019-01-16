const express = require('express'); 
const router = express.Router(); 
const { CLIENT } = require('../config'); 
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
  CLIENT.calls.create({ 
    url: 'http://demo.twilio.com/docs/voice.xml', 
    to: '+13019803889', 
    from: '+18026488173' 
  })
    .then((call) => { 
      console.log('call', call.sid); 
    })
    .done(() => { 
      res.end(); 
    }); 
}); 

module.exports = router; 