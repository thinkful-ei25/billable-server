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

// let mode='phone';
let mode='browser'; 

/**
 * TODO: programatically determine the mode
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

