'use strict';

const mongoose = require('mongoose');

const { TEST_DATABASE_URL } = require('../config');

const User=require('../models/user');
const Client=require('../models/client');
const Call=require('../models/call');
const {calls, users, clients} = require('../db/data');

console.log(`Connecting to mongodb at ${TEST_DATABASE_URL}`);

mongoose.connect(TEST_DATABASE_URL, { useNewUrlParser: true, useCreateIndex : true })
  .then(() => {
    console.info('Deleting Data...');
    return Promise.all([
      User.deleteMany(), 
      Client.deleteMany(), 
      Call.deleteMany()  
    ]);
  })
  .then(() => {
    console.info('Seeding Database...');
    return Promise.all([
      User.insertMany(users),
      Client.insertMany(clients),
      Call.insertMany(calls)
    ]);
  })
  .then(results => {
    console.log('Inserted', results);
    console.info('Disconnecting...');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });