'use strict';
const express = require('express');
const router = express.Router();
const { CLIENT } = require('../config');
const User = require('../models/user');
const Client = require('../models/client');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const createClient = require('../utils/createClient'); 

router.get('/', (req, res) => {
  console.log('test');
 createClient(req.user.email)
  .then(client => { 
    console.log('client', client); 
    res.json(client); 
  }); 
});

router.post('/inbound', (req, res, next) => {
  let callInfo;
  let twiMl = new VoiceResponse();
  const dial = twiMl.dial({});
  let allowedThrough = true;
  let allowedCallers = [];
  let reject = true;

  User.find({ 'twilio.phones.number': req.body.Called })
    .then(([user]) => {
      callInfo = {};
      (callInfo.callerId = req.body.From),
      (callInfo.phoneNumber = user.organizationPhoneNumber),
      (callInfo.userId = user.id);
      return callInfo;
    })
    .then(callInfo => {
      return Client.find(
        { userId: callInfo.userId },
        { _id: 0, phoneNumber: 1 }
      );
    })
    .then(clients => {
      clients.map(phoneNumber => {
        allowedCallers.push(phoneNumber.phoneNumber);
      });
      allowedThrough = allowedCallers.includes(callInfo.callerId);

      if (allowedThrough) {
        const dial = twiMl.dial({ callerId: callInfo.callerId });
        dial.number(callInfo.phoneNumber);
      }
      else {
        if(reject) {
          twiMl.reject(); 
        } else {
          twiMl.say('Sorry you are calling a restricted number. haha you sucker');
        }
      }
      return;
    })
    .then(() => {
      res
        .type('text/xml')
        .send(twiMl.toString())
        .end();
    })
    .catch(err => {
      console.log(err);
    });
});

router.post('/outbound', (req, res) => {

  createClient(req.user.email)
    .then(client => { 
      return client.calls.create({
        url: 'http://demo.twilio.com/docs/voice.xml',
        to: '+13019803889',
        from: '+18026488173'
      }); 
    })
    .then(call => {
      console.log('call', call.sid);
      res
        .json(call); 
    })
    .catch(err => { 
      console.log('err', err); 
    })
    .done(); 
    
});

module.exports = router;
