'use strict';
const express = require('express');
const router = express.Router();
// const User = require('../models/user');
// const Client = require('../models/client');
// const VoiceResponse = require('twilio').twiml.VoiceResponse;
const findClients = require('../utils/queries/findClients'); 
const findUser = require('../utils/queries/findUser'); 

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
function handlePhoneCalls(callerNumber, twilioNumberCalled){ 
  return findUser(twilioNumberCalled)
    .then(user => { 
      if (callerNumber === user.organizationPhoneNumber) { 
        return twilio.phoneOutgoing(); 
      }
      else { 
        return findClients(twilioNumberCalled)
          .then(clients => { 
            return twilio.phoneIncoming(clients, callerNumber, user.organizationPhoneNumber); 
        }); 
      }
    }); 
}

let mode='phone';

/**
 * TODO: programatically determine the mode
 */
router.post('/inbound', (req, res) => {
  const twilioNumberCalled = req.body.Called;
  const callerNumber = req.body.From;

  console.log('my twilio number', twilioNumberCalled); 
  console.log('your number', callerNumber); 

  if (mode === 'browser'){ 
    findUser(twilioNumberCalled)
      .then(user => { 
        const browserCallTwiMl = twilio.inboundBrowser(user.organizationName, callerNumber); 
        res
          .type('text/xml')
          .send(browserCallTwiMl); 
      }); 
  }
  else if (mode === 'phone'){ 
    handlePhoneCalls(callerNumber, twilioNumberCalled).then(voiceResponse => { 
      console.log('voiceResponce.toString()', voiceResponse); 

      res
        .type('text/xml')
        .send(voiceResponse);
    }); 
  } 

});

  // User.find({ 'twilio.phones.number': twilioNumberCalled })
  //   .then(([user]) => {
  //     userId = user.Id;
  //     usersRealNumber = user.organizationPhoneNumber;
  //     tokenName = user.organizationName; 
  //     return Client.find({ userId: userId }, { _id: 0, phoneNumber: 1 });
  //   })
  //   .then(clients => {
  //     if (mode === 'browser'){ 
 
  //     }
  //     else { 
  //       //CLIENT IS CALLING THEMSELVES
  //       if (callerNumber === usersRealNumber) {
  //        twilio.phoneOutgoing(); 
  //       }
  //       else {
  //         twilio.phoneIncoming(clients, usersRealNumber); 
  //       }
  //     }
  //     return;
  //     })
  //   .then(() => {
  //     console.log('broswer', browser); 

  //     res
  //       .type('text/xml')
  //       .send(browser); 
  //   })
  //   .catch(err => {
  //     console.log('err', err);
  //   });
      


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
  const outgoingCallTwiML = twilio.outboundBrowser(req.body.number);
  res.type('text/xml');
  res.send(outgoingCallTwiML);
});

module.exports = router;

