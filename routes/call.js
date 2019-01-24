'use strict';
const express = require('express');
const router = express.Router();
const findClients = require('../utils/queries/findClients');
const findUser = require('../utils/queries/findUser');
const Call = require('../models/call');
const twilio = require('../utils/twilio');
const moment = require('moment');

let mode;
// mode = 'browser';

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
  let _user;
  let responseTwiML;

  return findUser(twilioNumberCalled)
    .then(user => {
      _user = user;
      if (mode === 'browser') {
        responseTwiML = twilio.inboundBrowser(
          user.organizationName,
          callerNumber
        );
        return;
      } else if (callerNumber === _user.organizationPhoneNumber) {
        responseTwiML = twilio.gather();
        return;
      } else {
        return findClients(twilioNumberCalled, callerNumber);
      }
    })
    .then(client => {
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
 * @apiName Outbound Call
 * @apiGroup Call
 *
 * @param (body) {String}  toCallNumber Number entered in browser to call
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
    res.type('text/xml');
    res.send(redirectCallTwiML);
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
  const outgoingCallTwiML = twilio.outboundBrowser(req.body.number);
  res.type('text/xml');
  res.send(outgoingCallTwiML);
});

router.post('/events/:direction/:id/:to', (req, res) => {
  let organizationPhoneNumber, clientPhoneNumber;
  let { direction, id, to } = req.params;
  let { From } = req.body;
  to = '+1' + to;
  organizationPhoneNumber = direction === 'outgoing' ? From : to;
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

  return Call.create(newCall)
  .then(() => {
    res.status(200).end();
  })

});


module.exports = router;
