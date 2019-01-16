const express = require('express');
const router = express.Router();
const { CLIENT } = require('../config');
const User = require('../models/user');
const Client = require('../models/client');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

router.get('/', (req, res) => {
  console.log('test');
  res.json('test worked');
});

let reqBody = {
  twilio: {
    authToken: 'bcb71fb96c505025c24ba785f26692fd',
    accountFriendlyName: 'jsantiag@wellesley.edu',
    sid: 'AC96d4f4dbad42367168ac2012b1430a0d',
    status: 'active',
    phones: [
      {
        _id: '5c3f71c14435264a2cafaff8',
        phoneFriendlyName: 'jangles@gmail.com',
        number: '+18026488173'
      }
    ]
  },
  _id: '5c3f71c14435264a2cafaff7',
  id: '000000000000000000000000',
  email: 'jsantiag@wellesley.edu',
  organizationName: 'jsantiag Inc',
  organizationPhoneNumber: '+18025055503',
  globalHourlyRate: 20,
  password: '$2a$10$swigcZnoxlNuqXIzKP/k1eUqKjjL02Y5FM7IUau9K75H0yXp1xp1i',
  __v: 0
};

router.post('/inbound', (req, res) => {
  let callInfo;
  let twiMl = new VoiceResponse();
  const dial = twiMl.dial({});

  dial.number('+15558675310');
  User.find({ 'twilio.phones.number': req.body.Called })
    .then(([user]) => {
      callInfo = {};
      (callInfo.callerId = req.body.From),
      (callInfo.phoneNumber = user.organizationPhoneNumber),
      (callInfo.userId = user.id);
      return callInfo;
    })
    .then(callInfo => {
      return Client.find({ userId: callInfo.userId });
    })
    .then(clients => {
      const dial = twiMl.dial({ callerId: callInfo.callerId });
      dial.number(callInfo.phoneNumber);
      return;
    })
    .then(results => {
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
  console.log('Request Body', req.body);
  console.log('Request Params', req.params);
  console.log('Request Query', req.query);
  CLIENT.calls
    .create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: '+13019803889',
      from: '+18026488173'
    })
    .then(call => {
      console.log('call', call.sid);
    })
    .done(() => {
      res.end();
    });
});

module.exports = router;
