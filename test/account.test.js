'use strict'; 

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
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InR3aWxpbyI6eyJzdGF0dXMiOiJhY3RpdmUiLCJzaWQiOiJBQzFkODI2MWY0ZWUwM2RiZTEwMDVhZjc5NmFiODIxODQxIiwiYXV0aFRva2VuIjoiOWE1ZmM3YmE2YjcyMjE2MzVjZGM1MjIxZmY3ZTEwZDQiLCJhcHBTaWQiOiJBUDc1M2JhMzc5NTlkMjRiNTFiZjk2MjE1ZDRlMjlmNTU4IiwiYWNjb3VudEZyaWVuZGx5TmFtZSI6IkppbSBDYXJleSIsImRhdGVDcmVhdGVkIjoiMjAxOS0wMS0xN1QyMToxMjowNC4wMDBaIiwiZGF0ZVVwZGF0ZWQiOiIyMDE5LTAxLTE3VDIxOjEyOjA0LjAwMFoiLCJwaG9uZXMiOlt7Il9pZCI6IjVjNDBmMjUzNDE3OTAxYTMyZDA3YmExMyIsInBob25lRnJpZW5kbHlOYW1lIjoiSmltJ3MgUGhvbmUiLCJudW1iZXIiOiIrMTgwMjYxMzAzODkifV19LCJpc0xvZ2dlZEluIjp0cnVlLCJvcmdhbml6YXRpb25QaG9uZU51bWJlciI6IisxMzAxOTgwMzg4OSIsIm9yZ2FuaXphdGlvbk5hbWUiOiJKaW0gQ2FyZXkiLCJlbWFpbCI6InhlbWlodWN1QGJyYXVuNGVtYWlsLmNvbSIsInR1dG9yaWFsQ29tcGxldGVkIjp0cnVlLCJpZCI6IjVjNDBlZmE1NDE3OTAxYTMyZDA3YmExMiJ9LCJpYXQiOjE1NDg5ODg4OTEsImV4cCI6MTU0OTU5MzY5MSwic3ViIjoiSmltIENhcmV5In0.4EhwVKd64VAYHtH9WeUmT3Gq9MSPHA6WkviqbbQ5QiI';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../index');
const  User  = require('../models/user');
const {MASTER_CLIENT, JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('ACCOUNT endpoints', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  describe('/api/account/user', function(){
    it('should reject request without sid', function(){
      return chai
        .request(app)
        .get('/api/account/user')
        .then((res)=>{
          if(res.status === 400){
            throw res; 
          }
        })
        .catch(err => {
          expect(err).to.have.status(400);
        });
    });
    it('should reject request without correct sid', function(){
      return chai
        .request(app)
        .get('/api/account/user')
        .send({sid:'fakeSid'})
        .then((res)=>{
          if(res.status === 401){
            throw res; 
          }
        })
        .catch(err => {
          expect(err).to.have.status(401);
        });
    });
    it('should return a user object', function(){
      return chai 
        .request(app)
        .get('/api/account/user')
        .send({sid:testUser.twilio})
        .set('Authorization', `Bearer ${authToken}`)// <<== Add this
        .then((res)=>{
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object'); 
          expect(res.body).to.haveOwnProperty('authToken');
          expect(res.body).to.haveOwnProperty('friendlyName');
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body).to.haveOwnProperty('dateCreated');
          expect(res.body).to.haveOwnProperty('dateUpdated');
        });
    });
    it('should update status if active', function(){
      return chai
        .request(app)
        .put('/api/account/user/active')
        .send({sid:testUser.twilio.sid, email:testUser.email})
        .set('Authorization', `Bearer ${authToken}`)
        .then((res) =>{ 
          expect(res.body.twilio.status).to.equal('active'); 
          expect(res.body).to.be.an('object'); 
        });
    }); 
    it('should update status if suspended', function(){
      return chai
        .request(app)
        .put('/api/account/user/suspended')
        .send({sid:testUser.twilio.sid, email:testUser.email})
        .set('Authorization', `Bearer ${authToken}`)
        .then((res) =>{ 
          expect(res.body.twilio.status).to.equal('suspended'); 
          expect(res.body).to.be.an('object'); 
        });
    }); 
  });
});