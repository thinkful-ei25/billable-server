'use strict';

const express = require('express');
const router = express.Router();
const { MASTER_CLIENT, BASE_URL } = require('../config');
const User = require('../models/user');
const validateUser = require('../utils/validators/user.validate');
const isExistingUser = require('../utils/validators/existingUser.validate');
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });

router.post('/user', (req, res, next) => {
  console.log('CREATE A NEW USER');
  const { organizationName } = req.body;
  let account, password, user, appSid;

  isExistingUser(organizationName)
    .then(() => {
      return validateUser(req, res);
    })
    .then(validatedUser => {
      user = validatedUser;
      password = user.password;
      return MASTER_CLIENT.api.accounts.create({
        friendlyName: user.organizationName
      });
    })
    .then(createdAccount => {
      account = createdAccount;
      const subClient = require('twilio')(
        createdAccount.sid,
        createdAccount.authToken
      );
      console.log('subClient => ', subClient);
      return subClient.applications.create({
        voiceMethod: 'POST',
        voiceUrl: `${BASE_URL}/api/call/outbound`,
        friendlyName: 'Browser Dialer'
      });
    })
    .then(createdApp => {
      console.log('createdApp => ', createdApp);
      appSid = createdApp.sid;
      console.log('appSid => ', createdApp.sid);
      return User.hashPassword(password);
    })
    .then(digest => {
      const newUser = {
        email: user.email,
        organizationName: user.organizationName,
        password: digest,
        twilio: {
          authToken: account.authToken,
          sid: account.sid,
          dateCreated: account.dateCreated,
          dateUpdated: account.dateUpdated,
          accountFriendlyName: account.friendlyName,
          status: account.status,
          appSid: appSid
        }
      };
      return User.create(newUser);
    })
    .then(newUser => {
      console.log('newUser=> ', newUser);
      res
        .status(201)
        .location(`/api/users/${newUser.id}`)
        .json(newUser)
        .end();
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('User with that email address already exists');
        err.status = 400;
        err.reason = 'ValidationError';
        next(err);
      } else {
        res.json(err)
        next(err);
       }
    });
});

router.put('/endTutorial', jwtAuth, (req,res) => {
  const userId = req.user.id;
  User.findByIdAndUpdate(userId, {tutorialCompleted: true})
    .then(userResult => {
      console.log(userResult);
      res
        .status(201)
        .end();
    })
    .catch(err => {
      res.json(err); 
      console.log(err + 'tutorial update error');
      next(err); 
    });  
});

router.get('/phones', (req, res) => {
  console.log('FIND AVAILABLE PHONE NUMBERS');
  const { areaCode } = req.query;

  MASTER_CLIENT.availablePhoneNumbers('US')
    .local.list({
      areaCode,
      excludeAllAddressRequired: 'true',
      voiceEnabled: 'true'
    })
    .then(availableNumbers => {
      // console.log('availableNumber', availableNumbers[0]);
      let phoneNumbers = [];
      for (let i = 0; i < availableNumbers.length; i++) {
        let phoneNumber = {
          response: availableNumbers[i].phoneNumber,
          display: availableNumbers[i].friendlyName
        };
        phoneNumbers.push(phoneNumber);
      }
      console.log('===========');
      console.log('phoneNumber', phoneNumbers);
      console.log('===========');
      res.json(phoneNumbers);
    })
    .catch(err => {
      console.log('err', err);
    });
});

module.exports = router;
