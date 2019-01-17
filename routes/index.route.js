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

const jwtAuth = passport.authenticate('jwt', { session: false });

router.use('/register', register); 
router.use('/', auth); 
router.use('/phone', jwtAuth, phone); 
router.use('/call', jwtAuth, call); 
router.use('/account', jwtAuth, account); 
router.use('/client', jwtAuth, client); 


  
// Custom Error Handler
router.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router; 