'use strict'; 
const express = require('express'); 
const router = express.Router(); 
const User = require('../models/user'); 
const Client = require('../models/client');
const Call = require('../models/call');


router.delete('/user-delete', (req,res,next)=>{
  const userId = req.user.twilio.sid; 
  console.log(userId);
  const clientRef = req.user.id; 
  console.log(clientRef); 

  Call.deleteMany({userSid:userId})
    .then(() => 
      console.log('deleting the calls...'),
    res.status(200)
      .json()
    ).catch(err => {
      next(err); 
    }); 

  Client.deleteMany({userId:clientRef})
    .then(() =>
      console.log('deleting the clients...') 
    ).catch(err => {
      next(err); 
    }); 

  User.deleteOne({_id:clientRef})
    .then(()=>
      console.log('deleting the user')
    ).catch(err=> {
      next(err); 
    }); 
});


router.put('/', (req, res, next) => {
  const userId = req.user.id;
  const toUpdate = {};
  const updateableFields = ['email', 'password','organizationPhoneNumber', 'globalHourlyRate'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field]=req.body[field];
    }
  });


  if(toUpdate.hasOwnProperty('password')){
    User.hashPassword(req.body['password'])
      .then((digest)=>{
        toUpdate['password']=digest; 
        saveUser(toUpdate);
      }); 
  }else{
    saveUser(toUpdate);
  }
  function saveUser(toUpdate){

    User.findOneAndUpdate({_id: userId}, toUpdate, { new: true })
      .then(result =>{
        console.log('after result', toUpdate); 
        if(result){
          console.log(result);
          res.json(result);
        } else {
          next();
        }
      })
      .catch(err => {
        next(err);
      });
  }
});
    
router.get('/user', (req,res,next)=>{
  let userId = req.user.id; 

  User.findById({_id:userId}, {email:1, organizationPhoneNumber:1, globalHourlyRate:1})
    .then(result => {
      if(result){
        res.json(result)
          .sendStatus(200);
      }else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});



// router.delete('/delete', (req, res, next) => )

module.exports = router; 