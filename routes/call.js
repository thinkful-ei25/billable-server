'use strict';
const express = require('express');
const router = express.Router();
const findClients = require('../utils/queries/findClients'); 
const findUser = require('../utils/queries/findUser'); 
const twilio = require('../utils/twilio');

// let mode='phone';
let mode='browser'; 

/**
 * @api [post] /call/inbound Handles inbound calls and routes the call based on the caller.
 * @apiName Inbound Call
 * @apiGroup Call
 *
 * @apiParam (body) {String}  Called  The Twilio Number that was dialed
 * @apiParam (body) {String} From  The number of the caller
 * TODO: get incoming call from browswer to dial
 */
router.post('/inbound', (req, res) => {
  const twilioNumberCalled = req.body.Called;
  const callerNumber = req.body.From;

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
      
      res
        .type('text/xml')
        .send(voiceResponse);
    }); 
  }
});

/**
 * @api [post] /call/inbound/gather Called by /call/inbound when User Calls their own Twilio Number
 * @apiName Outbound Call
 * @apiGroup Call
 *
 * @param (body) {String}  toCallNumber Number entered in browser to call
 * TODO: Review what happens if no numbers are inputted.
 */
router.post('/inbound/gather', (req, res) => {
  const toCallNumber = `+1${req.body.Digits}`;

  const redirectCallTwiML = twilio.phoneOutgoing(toCallNumber, req.body.From);
  res.send(redirectCallTwiML);
});

/**
 * @api [post] /call/outbound Request outgoing call information
 * @apiName Outbound Call
 * @apiGroup Call
 *
 * @apiParam (body) {String}  toCallNumber Number entered in browser to call
 *
 */
router.post('/outbound', (req, res) => {
  const outgoingCallTwiML = twilio.outboundBrowser(req.body.number);
  res.type('text/xml');
  res.send(outgoingCallTwiML);
});

//TODO: PUT THIS IN A UTIL
function handlePhoneCalls(callerNumber, twilioNumberCalled){ 
  return findUser(twilioNumberCalled)
    .then(user => { 
      if (callerNumber === user.organizationPhoneNumber) { 
        return twilio.gather(user.organizationPhoneNumber); 
      }
      else { 
        return findClients(twilioNumberCalled)
          .then(clients => { 
            return twilio.phoneIncoming(clients, callerNumber, user.organizationPhoneNumber); 
        }); 
      }
    }); 
}

module.exports = router;
