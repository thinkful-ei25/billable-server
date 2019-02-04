'use strict'; 

const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../index');
const {  TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;
require('dotenv');

const authToken=process.env.TEST_AUTH_TOKEN;
chai.use(chaiHttp);


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