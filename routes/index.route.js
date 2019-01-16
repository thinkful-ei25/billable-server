'use strict'; 

const express = require('express'); 
const router = express.Router(); 

const passport = require('passport');

const auth = require('./auth'); 
const phone = require('./phone'); 
const register = require('./register'); 
const call = require('./call'); 
const account = require('./account'); 

const jwtAuth = passport.authenticate('jwt', { session: false });

router.use('/register', register); 
router.use('/', auth); 
router.use('/phone', jwtAuth, phone); 
router.use('/call', jwtAuth, call); 
router.use('/account', jwtAuth, account); 

module.exports = router; 