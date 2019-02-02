'use strict'; 

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../index');
const Client = require('../models/client'); 
const findClient = require('../utils/queries/findClients');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp); 

