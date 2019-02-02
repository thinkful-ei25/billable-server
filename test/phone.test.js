'use strict'; 

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../index');
const  User  = require('../models/user');
const { MASTER_CLIENT, BASE_URL } = require('../config'); 
const createSubAccountClient = require('../utils/createSubAccountClient'); 
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp); 

