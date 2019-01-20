'use strict';

require('dotenv').config();
const twilio = require('twilio'); 

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DATABASE_URL:
        process.env.DATABASE_URL || 'mongodb://localhost/billable-backend',
  TEST_DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        'mongodb://localhost/thinkful-backend-test', 
       
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID, 
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  MASTER_CLIENT: twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN), 
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
  TWILIO_APP_SID: process.env.TWILIO_APP_SID,
  //Brady
  BASE_URL: '5421475d.ngrok.io',
  //Sean 
  // BASE_URL: 'a0f13081.ngrok.io', 
  TWILIO_NUMBER: process.env.TWILIO_NUMBER
};
