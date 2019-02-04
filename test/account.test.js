'use strict'; 
require('dotenv');

require('dotenv').config();

const testUser = process.env.TEST_USER; 
const authToken = process.env.TEST_AUTH_TOKEN; 


const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../index');
const {TEST_DATABASE_URL } = require('../config');

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