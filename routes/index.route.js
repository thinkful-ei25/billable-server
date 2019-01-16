'use strict'; 

const express = require('express'); 
const router = express.Router(); 

const auth = require('./auth'); 
const phone = require('./phone'); 
const register = require('./register'); 
const call = require('./call'); 
const account = require('./account'); 

router.use('/', auth); 
router.use('/phone', phone); 
router.use('/register', register); 
router.use('/call', call); 
router.use('/account', account); 
module.exports = router; 