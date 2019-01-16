'use strict'; 

const { Strategy: LocalStrategy } = require('passport-local'); 
const User = require('../models/user');

const localStrategy = new LocalStrategy(
  { usernameField: 'organizationName', passwordField: 'password'}, (organizationName, password, done)=> {
  let user; 
  User.findOne({ organizationName })
    .then(results => {
      console.log('result', results.organizationName, results.email, results.password); 
      user = results; 
      if (!user) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect organization name',
          location: 'organization name'
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if(!isValid){
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect password', 
          location: 'password'
        });
      }
      return done(null, user); 
    }) 
    .catch(err => {
      if(err.reason === 'LoginError') {
        return done(null, false); 
      }
      return done(err); 
    }); 
});


module.exports = localStrategy;
