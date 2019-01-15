'use strict';

const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');

//const {} = require('../models/...');
// const {} = require('../db/data');

console.log(`Connecting to mongodb at ${DATABASE_URL}`);

mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useCreateIndex : true })
  .then(() => {
    console.info('Deleting Data...');
    return Promise.all([
      //collection.deleteMany(docs)
    
    ]);
  })
  .then(() => {
    console.info('Seeding Database...');
    return Promise.all([
      //collection.insertMany(docs)
   
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