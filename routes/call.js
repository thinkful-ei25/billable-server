'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Client = require('../models/client');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const createSubAccountClient = require('../utils/createSubAccountClient');

router.get('/', (req, res) => {
  console.log('test');
  createSubAccountClient(req.user.email)
    .then(client => { 
      console.log('client', client); 
      res.json(client); 
    }); 
});

/*

Twilio#: +18026130389
Organization#: 3019803889

  Call Comes in to Twilio #
  Check if the req.body.From = organizationPhoneNumber
  If No - continue with normal process

  If Yes  -
    - Say - Who are you looking to call?
    - Record Key Pad
    - Repeat Numebrs and Confirm
    - Say Sweet - calling now
    -Dial Numbers entered from keypad
    -Call ID = Organization Number
*/

router.post('/inbound', (req, res, next) => {
  let twiMl = new VoiceResponse();
  let callInfo = {
    callerId: req.body.From
  };
  let allowedThrough;
  let allowedCallers = [];
  let reject = true;

  User.find({'twilio.phones.number': req.body.Called})
    .then(([user]) => {
      callInfo.phoneNumber = user.organizationPhoneNumber;
      callInfo.userId = user.id;
      return callInfo;
    })
    .then(callInfo => {

    })
});

router.post('/inbound', (req, res, next) => {
  // Use the Twilio Node.js SDK to build an XML response
  let twiMl = new VoiceResponse();
  let callInfo = {
    callerId: req.body.From
  };
  let allowedThrough;
  let allowedCallers = [];
  let reject = true;
  // Lookup the user with the Twilio Number that was Called
  User.find({ 'twilio.phones.number': req.body.Called })
    .then(([user]) => {
      callInfo.phoneNumber = user.organizationPhoneNumber;
      callInfo.userId = user.id;
      return callInfo;
    })
    .then(callInfo => {
      return Client.find(
        { userId: callInfo.userId },
        { _id: 0, phoneNumber: 1 }
      );
    })
    .then(clients => {
      if (callInfo.callerId === callInfo.phoneNumber) {
        const gather = twiMl.gather({
          numDigits: 10,
          action: '/api/call/gather',
          finishOnKey: '#'
        });
        gather.say(
          'Enter the number you are trying to reach followed by the pound sign.'
        );
      } else {
        clients.map(phoneNumber => {
          allowedCallers.push(phoneNumber.phoneNumber);
        });
        // allowedThrough = allowedCallers.includes(callInfo.callerId);
        allowedThrough = true;
        if (allowedThrough) {
          const dial = twiMl.dial({ callerId: callInfo.callerId });
          dial.number(callInfo.phoneNumber);
        } else {
          if (reject) {
            twiMl.reject();
          } else {
            twiMl.say('Sorry you are calling a restricted number.');
          }
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

router.post('/gather', (req, res) => {
  const twiMl = new VoiceResponse();
  let numberToCall = `+1${req.body.Digits}`;
  console.log(typeof numberToCall);
  console.log('Digits => ', req.body.Digits);
  console.log('req.body.Caller => ', req.body.Caller);
  twiMl.dial(numberToCall);

  // if (req.body.Digits) {
  //   const dial = twiMl.dial({ callerId: req.body.Caller });
  //   dial.number(numberToCall);
  // }

  return twiMl.toString();
});

router.post('/outbound', (req, res) => {
  createSubAccountClient(req.user.email)
    .then(client => {
      return client.calls.create({
        url: 'http://demo.twilio.com/docs/voice.xml',
        to: '+13019803889',
        from: '+18026488173'
      });
    })
    .then(call => {
      console.log('call', call.sid);
      res.json(call);
    })
    .catch(err => {
      console.log('err', err);
    })
    .done();
});

module.exports = router;
