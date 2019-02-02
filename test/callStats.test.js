'use strict'; 

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../index');
const  Call  = require('../models/call');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

const testUser = {
  '_id': {
    '$oid': '5c40efa5417901a32d07ba12'
  },
  'organizationPhoneNumber': '+13019803889',
  'twilio': {
    'status': 'active',
    'sid': 'AC1d8261f4ee03dbe1005af796ab821841',
    'authToken': '9a5fc7ba6b7221635cdc5221ff7e10d4',
    'appSid': 'AP753ba37959d24b51bf96215d4e29f558',
    'accountFriendlyName': 'Jim Carey',
    'dateCreated': {
      '$date': '2019-01-17T21:12:04.000Z'
    },
    'dateUpdated': {
      '$date': '2019-01-17T21:12:04.000Z'
    },
    'phones': [
      {
        '_id': {
          '$oid': '5c40f253417901a32d07ba13'
        },
        'phoneFriendlyName': 'Jim\'s Phone',
        'number': '+18026130389'
      }
    ]
  },
  'organizationName': 'Jim Carey',
  'password': '$2a$10$IGPNMUI2p2JIRJSkjbXw5OmDcJqfgvyxVER9RRzDLIexKOgKnAUoC',
  'email': 'xemihucu@braun4email.com',
  '__v': 1,
  'isLoggedIn': true,
  'tutorialCompleted': true
};
const authToken ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InR3aWxpbyI6eyJzdGF0dXMiOiJhY3RpdmUiLCJzaWQiOiJBQzFkODI2MWY0ZWUwM2RiZTEwMDVhZjc5NmFiODIxODQxIiwiYXV0aFRva2VuIjoiOWE1ZmM3YmE2YjcyMjE2MzVjZGM1MjIxZmY3ZTEwZDQiLCJhcHBTaWQiOiJBUDc1M2JhMzc5NTlkMjRiNTFiZjk2MjE1ZDRlMjlmNTU4IiwiYWNjb3VudEZyaWVuZGx5TmFtZSI6IkppbSBDYXJleSIsImRhdGVDcmVhdGVkIjoiMjAxOS0wMS0xN1QyMToxMjowNC4wMDBaIiwiZGF0ZVVwZGF0ZWQiOiIyMDE5LTAxLTE3VDIxOjEyOjA0LjAwMFoiLCJwaG9uZXMiOlt7Il9pZCI6IjVjNDBmMjUzNDE3OTAxYTMyZDA3YmExMyIsInBob25lRnJpZW5kbHlOYW1lIjoiSmltJ3MgUGhvbmUiLCJudW1iZXIiOiIrMTgwMjYxMzAzODkifV19LCJpc0xvZ2dlZEluIjpmYWxzZSwib3JnYW5pemF0aW9uUGhvbmVOdW1iZXIiOiIrMTMwMTk4MDM4ODkiLCJvcmdhbml6YXRpb25OYW1lIjoiSmltIENhcmV5IiwiZW1haWwiOiJ4ZW1paHVjdUBicmF1bjRlbWFpbC5jb20iLCJ0dXRvcmlhbENvbXBsZXRlZCI6dHJ1ZSwiaWQiOiI1YzQwZWZhNTQxNzkwMWEzMmQwN2JhMTIifSwiaWF0IjoxNTQ5MDI5OTY4LCJleHAiOjE1NDk2MzQ3NjgsInN1YiI6IkppbSBDYXJleSJ9.U7pJuWGPJ5PJFVwwvcfTXKkV4xRjvMWYaqcXcwLrt6o';
const clientId = '5c53227fb2819846ac64894d';
describe('CallStats endpoints', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });
  describe('api/call/stats/all', function(){
    it('should reject requests without authToken', function(){
      return chai
        .request(app)
        .get('api/call/stats/all')
        .then(res => {
          expect(res).to.be('undefined');
        })
        .catch(err => {
          console.log(err); 
        });
    });
    it('should return all call stats for a user', function(){
      return chai 
        .request(app)
        .get('/api/call/stats/all')
        .set('Authorization', `Bearer ${authToken}`)// <<== Add this
        .then(res => {
          console.log('call stats',res.body); 
          expect(res).to.be.an('object');
          expect(res).to.have.status(200); 
        });
    });
  });
});
