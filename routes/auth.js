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

function findCapabilityTokenByID(userId) {
  return User.findById(userId)
    .then(user => {
      let clientBrowserName = user.organizationName.replace(/ /g, '');
      const capabilityToken = twilio.token(user.twilio.sid, user.twilio.authToken, clientBrowserName, user.twilio.appSid);
      return capabilityToken;
    }); 
}

router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  const {id} = req.user; 
  let capabilityToken;
  return findCapabilityTokenByID(id)
    .then(recievedCapabilityToken => { 
      capabilityToken = recievedCapabilityToken;
      return User.findByIdAndUpdate(id, { isLoggedIn : true }); 
    })
    .then(user => { 
      const {tutorialCompleted} = user;
      res.json({authToken, capabilityToken, tutorialCompleted}); 
      // console.log(`${user.organizationName} has been logged in`); 
    })
    .catch(err => { 
      
      err.status(400); 
      res.send(400);  
    }); 
});

router.post('/logout', jwtAuth, (req, res) => { 
  const {id} = req.user; 

  return User.findByIdAndUpdate(id, { isLoggedIn: false})
    .then(user => { 
      res
        .status(200)
        .end(); 
    })
    .catch(err => { 
      console.log('err', err); 
    }); 
}); 

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  const {id} = req.user; 
  return findCapabilityTokenByID(id)
    .then(capabilityToken => { 
      res.json({authToken, capabilityToken}); 
    }); 
});



module.exports = router;
