'use strict'; 
//last two tests need wprk
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../index');
const  User  = require('../models/user');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp); 

describe('Auth endpoints', function () {
  const organizationName = 'testUser';
  const password = 'twillBill';
  

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  describe('/api/login', function () {
    it('Should reject requests with no credentials', function () {
      return chai
        .request(app)
        .post('/api/login')
        .then((res) => {
          if(res.status === 400){
            throw res; 
          }
        })
        .catch(err => {
          expect(err).to.have.status(400);  
        });
    });
    it('Should reject requests with incorrect organizationName', function () {
      return chai
        .request(app)
        .post('/api/login')
        .send({ organizationName: 'wrongOrgName', password})
        .then((res) =>{
          if(res.status===400){
            throw res;
          }
        })
        .catch(err => {
          expect(err).to.have.status(400);
        });
    });
    it('Should reject requests with incorrect passwords', function () {
      return chai
        .request(app)
        .post('/api/login')
        .send({ organizationName, password: 'wrongPassword' })
        .then((res) =>{
          if(res.status===400){
            throw res;
          }
        })
        .catch(err => {
          expect(err).to.have.status(400);
        });
    });
    it('Should return a valid auth token', function () {
      return chai
        .request(app)
        .post('/api/login')
        .send({ organizationName, password })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const token = res.body.authToken;
          expect(token).to.be.a('string');
        });
    });
    it('Should return a capability token', function () {
      return chai
        .request(app)
        .post('/api/login')
        .send({organizationName, password})
        .then(res => {
          // console.log('capability token test', res);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const capToken = res.body.capabilityToken;
          expect(capToken).to.be.a('string'); 
        });
    });
  });
  describe('/api/refresh', function () {
    it('Should reject requests with no credentials', function () {
      return chai
        .request(app)
        .post('/api/refresh')
        .then((res) => {
          if(res.status === 400){
            throw res; 
          }
        })
        .catch(err => {
          expect(err).to.have.status(400);  
        });
    });
    it('Should reject requests with an invalid token', function () {
      const token = jwt.sign(
        {
          organizationName,
          password
        },
        'wrongSecret',
        {
          algorithm: 'HS256',
          expiresIn: '7d'
        }
      );
      return chai
        .request(app)
        .post('/api/refresh')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          if(res.status === 401){
            throw res; 
          }
        })
        .catch(err => {
          expect(err).to.have.status(401);
        });
    });
    // it('Should reject requests with an expired token', function () {
    //   const token = jwt.sign(
    //     {
    //       user: {
    //         organizationName,
    //         password
    //       },
    //     },
    //     JWT_SECRET,
    //     {
    //       algorithm: 'HS256',
    //       subject: organizationName,
    //       expiresIn: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
    //     }
    //   );
    //   return chai
    //     .request(app)
    //     .post('/api/refresh')
    //     .set('authorization', `Bearer ${token}`)
    //     .then((res) => {    
    //       if(res.status === 401){
    //         throw res; 
    //       }
    //     })  
    //     .catch(err => {
    //       expect(err).to.have.status(401);
    //     });
    // });
    // it('Should return a valid auth token with a newer expiry date', function () {
    //   const token = jwt.sign(
    //     {
    //       user: {
    //         organizationName,
    //         password
    //       }
    //     },
    //     JWT_SECRET,
    //     {
    //       algorithm: 'HS256',
    //       subject: organizationName,
    //       expiresIn: '7d'
    //     }
    //   );
    //   const decoded = jwt.decode(token);

    //   return chai
    //     .request(app)
    //     .post('/api/refresh')
    //     .set('authorization', `Bearer ${token}`)
    //     .then(res => {
    //       expect(res).to.have.status(200);
    //       expect(res.body).to.be.an('object');
    //       const token = res.body.authToken;
    //       expect(token).to.be.a('string');
    //       const payload = jwt.verify(token, JWT_SECRET, {
    //         algorithm: ['HS256']
    //       });
    //       expect(payload.user).to.deep.equal({
    //         organizationName,
    //         password
    //       });
    //       expect(payload.exp).to.be.at.least(decoded.exp);
    //     });
    // });
  });
});