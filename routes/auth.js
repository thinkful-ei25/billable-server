'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const twilio = require('./twilio');

const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const router = express.Router();

const localAuth = passport.authenticate('local', {
  session: false,
  failWithError: true
});

const jwtAuth = passport.authenticate('jwt', {
  session: false,
  failWithError: true
});

function createAuthToken(user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.organizationName,
    expiresIn: JWT_EXPIRY
  });
}

router.post('/login', localAuth, (req, res) => {
  console.log('user', req.user);
  const authToken = createAuthToken(req.user);

  res.json({ authToken });
});

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

/**
 * @api [post] /token
 * description: "Returns a capability token to allow user to make inbrowser calling"
 * parameters:
 *  -(body) accountSid {String - required} The twilio accountSID of the user
 *  -(body) authToken {String - required} The twilio authToken for the user
 * responses:
 *  200:
 *    description: twilio capabilityToken
 *
 * TODO: Discuss how route receives accountSid and authToken
 */

router.post('/token', (req, res) => {
  const accountSid = req.body.accountSid;
  const authToken = req.body.authToken;
  console.log('POST /token for account SID: ' + accountSid);
  const capabilityToken = twilio.token(accountSid, authToken);
  console.log('##### Capability Token:  ' + capabilityToken + ' #####');
  res.send(capabilityToken);
});

module.exports = router;
