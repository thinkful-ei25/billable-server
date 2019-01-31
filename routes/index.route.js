'use strict';

const express = require('express');
const router = express.Router();

const passport = require('passport');

const auth = require('./auth');
const phone = require('./phone');
const register = require('./register');
const call = require('./call');
const account = require('./account');
const client = require('./client');
const callStats = require('./callStats');
const settings = require('./settings'); 
const invoices = require('./invoices');

const jwtAuth = passport.authenticate('jwt', { session: false });

router.use('/register', register);
router.use('/', auth);
router.use('/call', call);
router.use('/phone', jwtAuth, phone);
router.use('/account',jwtAuth, account);
router.use('/client', jwtAuth, client);
router.use('/settings', jwtAuth, settings);
router.use('/call', jwtAuth, callStats);
router.use('/invoices', jwtAuth, invoices);

// Custom Error Handler
// router.use((err, req, res, next) => {
//   if (err.status) 
//     const errBody = Object.assign({}, err, { message: err.message });
//     res.status(err.status).json(errBody);
//   } else {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

module.exports = router;
