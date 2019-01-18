'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Client = require('../models/client');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const createSubAccountClient = require('../utils/createSubAccountClient');

//TODO: Remove Get Route
//TODO: Update Errors where possible

router.post('/inbound', (req, res, next) => {

  let twiMl = new VoiceResponse();
  let callInfo = {
    callerId: req.body.From
  };
  let allowedThrough;
  let allowedCallers = [];
  let reject = true;

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
          action: '/api/call/inbound/gather',
          method: 'POST',
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

router.post('/inbound/gather', (req, res) => {
  const twiMl = new VoiceResponse();
  let numberToCall = `+1${req.body.Digits}`;
  twiMl.dial(numberToCall);

  if (req.body.Digits) {
    const dial = twiMl.dial({ callerId: req.body.Caller });
    dial.number(numberToCall);
  }

  res.type('text/xml');
  res.send(twiMl.toString());

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
