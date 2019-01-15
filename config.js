'use strict';

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DATABASE_URL:
        process.env.DATABASE_URL || 'mongodb://localhost/thinkful-backend',
  TEST_DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        'mongodb://localhost/thinkful-backend-test', 
  TEST_TWILIO_ACCOUNT_SID: 'AC96d4f4dbad42367168ac2012b1430a0d', 
  TEST_TWILIO_AUTH_TOKEN: 'bcb71fb96c505025c24ba785f26692fd',
  TWILIO_ACCOUNT_SID: 'AC5ad320be60c4f745deea8e44f06b8906', 
  TWILIO_AUTH_TOKEN: '0c9ac2effe05bf249813fbf5c037b6ff'
  // DATABASE_URL:
  //     process.env.DATABASE_URL || 'postgres://localhost/thinkful-backend',
  // TEST_DATABASE_URL:
  //     process.env.TEST_DATABASE_URL ||
  //     'postgres://localhost/thinkful-backend-test'
};
