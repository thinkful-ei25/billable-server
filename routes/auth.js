'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const twilio = require('../utils/twilio');
const User = require('../models/user');

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

function findUserByID(userId) {
  return User.findById(userId)
    .then(user => {
      let clientBrowserName = user.organizationName.replace(/ /g, '');
      console.log('##### REFRESH clientBrowserName:  ' + user.twilio.authToken + ' #####');
      const capabilityToken = twilio.token(user.twilio.sid, user.twilio.authToken, clientBrowserName);
      console.log('##### Capability Token:  ' + capabilityToken + ' #####');
      return capabilityToken;
    }); 
}

router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  return findUserByID(req.user)
    .then(capabilityToken => {
    res.json({authToken, capabilityToken})
  })
});

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  return findUserByID(req.user)
    .then(capabilityToken => {
      res.json({ authToken, capabilityToken })
  });
});



module.exports = router;
