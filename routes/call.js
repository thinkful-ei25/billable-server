'use strict';
const express = require('express');
const router = express.Router();
const findClients = require('../utils/queries/findClients');
const findUser = require('../utils/queries/findUser');
const User = require('../models/user'); 
const Client = require('../models/client'); 
const Call = require('../models/call');
const twilio = require('../utils/twilio');
const moment = require('moment');


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
  console.log('inbound', req.body); 
  const twilioNumberCalled = req.body.Called;
  const callerNumber = req.body.From;
  let _user;
  let responseTwiML;
 
  
  return findUser(twilioNumberCalled)
    .then(user => {
      _user = user;
      console.log('/inbound user line 34 => ', _user);
      if (user.isLoggedIn) { 
        return findClients(twilioNumberCalled, callerNumber)
          .then(client => { 
            let clientId = client[0]._id; 
            responseTwiML = twilio.inboundBrowser(
              user.organizationName, callerNumber, clientId, _user.organizationPhoneNumber); 
              //return;
          }); 
      } else if (callerNumber === _user.organizationPhoneNumber) {
        responseTwiML = twilio.gather();
        return;
      } else {
        return findClients(twilioNumberCalled, callerNumber);
      }
    })
    .then(client => {
      console.log('/INBOUND => Client ', client )
      console.log('INBOUND RESPONSE TWIML  =>', responseTwiML);
      if (client) {
        responseTwiML = twilio.phoneIncoming(
          client,
          callerNumber,
          _user.organizationPhoneNumber
        );
      }
      res.type('text/xml').send(responseTwiML);
    });
});

/**
 * @api [post] /call/inbound/gather Called by /call/inbound when User Calls their own Twilio Number
 * @apiName Gather Call
 * @apiGroup Call
 *
 * TODO: Review what happens if no numbers are inputted.
 */
router.post('/inbound/gather', (req, res) => {
  const toCallNumber = `+1${req.body.Digits}`;
  let twilioNumberCalled = req.body.Called;
  let organizationPhoneNumber = req.body.From;
  findClients(twilioNumberCalled, toCallNumber).then(client => {
    const redirectCallTwiML = twilio.phoneOutgoing(
      client,
      toCallNumber,
      organizationPhoneNumber
    );
    res.type('text/xml').send(redirectCallTwiML);
  });
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
  let clientPhoneNumber = '+1' + req.body.number.toString(); 
  let organizationPhoneNumber, twilioNumber; 
  User.findOne({'twilio.sid' : req.body.AccountSid} )
    .then((user) => { 
      organizationPhoneNumber = user.organizationPhoneNumber; 
      twilioNumber = user.twilio.phones[0].number;

      return Client.findOne({phoneNumber: clientPhoneNumber, userId: user._id}); 
    })
    .then(client => { 
      const outgoingCallTwiML = twilio.outboundBrowser(req.body.number, client._id, organizationPhoneNumber, twilioNumber);
      res.type('text/xml').send(outgoingCallTwiML);
    })
    .catch(err => {
      console.log('/outbound error => ', err);
    }); 
});

/**
 * @api [post] /call/events Handles all completed calls.
 * @apiName Call Events
 * @apiGroup Call
 *
 * @apiParam {String}  direction determines if the call was inbound or outbound
 * @apiParam {String} the client associated with the call
 * @apiParam {String} the number of the recipient of the call.
 * 
 * TODO: Review edge cases of callers.
 *
 */

router.post('/events/:direction/:id/:to', (req, res) => {
  let organizationPhoneNumber, clientPhoneNumber;
  let { direction, id, to } = req.params;
  let { From } = req.body;
  organizationPhoneNumber = direction === 'outgoing' ? From : '+1' + to;
  clientPhoneNumber = direction === 'outgoing' ? to : From;

  let newCall = {
    id: id,
    userSid: req.body.AccountSid,
    startTime: moment()
      .subtract(Number(req.body.DialCallDuration), 's')
      .toDate(),
    endTime: moment().toDate(),
    duration: req.body.DialCallDuration,
    organizationPhoneNumber,
    clientPhoneNumber,
    callSid: req.body.DialCallSid,
    direction,
    status: req.body.CallStatus
  };

  return Call.create(newCall).then(() => {
    let hangupTwiML = twilio.hangup();
    res.type('text/xml').send(hangupTwiML);
  });
});

module.exports = router;
