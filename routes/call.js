'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Client = require('../models/client');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const createSubAccountClient = require('../utils/createSubAccountClient');
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_APP_SID,
  TWILIO_NUMBER
} = require('../config');
const twilio = require('./twilio');

/**
 * @api [post] /call/inbound Handles inbound calls and routes the call based on the caller.
 * @apiName Inbound Call
 * @apiGroup Call
 *
 * @apiParam (body) {String}  Called  The Twilio Number that was dialed
 * @apiParam (body) {String} From  The number of the caller
 *
 *
 * TODO: Document Responses for Success and Failed
 * TODO: Review how to consolidate with new twilio file
 *
 */

router.post('/inbound', (req, res) => {
  const twiMl = new VoiceResponse();
  const twilioNumberCalled = req.body.Called;
  const callerNumber = req.body.From;
  let userId;
  let usersRealNumber;

  let allowedThrough;
  let allowedCallers = [];
  let reject = true;

  let mode='browser';
  // let mode='phone';

  User.find({ 'twilio.phones.number': twilioNumberCalled })
    .then(([user]) => {
      userId = user.Id;
      usersRealNumber = user.organizationPhoneNumber;
      return Client.find({ userId: userId }, { _id: 0, phoneNumber: 1 });
    })
    .then(clients => {
      //CLIENT IS CALLING THEMSELVES
      if (callerNumber === usersRealNumber) {
        if (mode === 'browser'){ 
          twilio.inbound(); 
        }
        else if (mode === 'phone') { 
          const gather = twiMl.gather({
            numDigits: 10,
            action: '/api/call/inbound/gather',
            method: 'POST',
            finishOnKey: '#'
          });
          gather.say(
            'Enter the number you are trying to reach followed by the pound sign.'
          );
        }
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

/**
 * @api [post] /call/inbound/gather Called by /call/inbound when User Calls their own Twilio Number
 * @apiName Outbound Call
 * @apiGroup Call
 *
 * @apiParam (body) {String}  toCallNumber Number entered in browser to call
 *
 * TODO: Document Responses for Success
 * TODO: Review what happens if no numbers are inputted.
 *
 */

router.post('/inbound/gather', (req, res) => {
  const toCallNumber = `+1${req.body.Digits}`;
  const redirectCallTwiML = twilio.gather(toCallNumber);
  res.send(redirectCallTwiML);
});

/**
 * @api [post] /call/outbound Request outgoing call information
 * @apiName Outbound Call
 * @apiGroup Call
 *
 * @apiParam (body) {String}  toCallNumber Number entered in browser to call
 *
 * TODO: Document Responses for Success
 *
 */

router.post('/outbound', (req, res) => {
  console.log('call body ' + JSON.stringify(req.body));
  const outgoingCallTwiML = twilio.browser(req.body.number);
  res.type('text/xml');
  res.send(outgoingCallTwiML);
});

module.exports = router;

