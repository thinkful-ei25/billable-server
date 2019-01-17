'use strict'; 
const express = require('express'); 
const router = express.Router(); 
const Client = require('../models/client'); 
// const jwtAuth = passport.authenticate('jwt', { session: false });



//CREATE NEW CLIENT
router.post('/', (req, res) => {
  const userId = req.user.id; 
  const {firstName,company, lastName, hourlyRate, phoneNumber} = req.body;
  const newClient = {company,userId, firstName, lastName, hourlyRate, phoneNumber}; 

  Client.create(newClient)
    .then(result => {
      res 
        .location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      console.log(err +'client creation error');
    });
});

router.get('/', (req, res) => {
  const userId = req.user.id;
  let filter = {};  
  
  filter.userId = userId; 

  Client.find(filter)
    .sort('lastName')
    .then(results => {
      res
        .status(200)
        .json(results);
    })
    .catch(err => {
      console.log(err, 'ono, client retrieval error');
    });
});

router.get('/:id', (req, res, next) => {
  const {id} = req.params; 
  const userId = req.user.id; 

  Client.findById({_id:id, userId})
    .then(result => {
      res.json(result); 
    })
    .catch(err => {
      console.log('ono, findbyId for client didn\'t work');
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const {id} = req.params; 
  const userId = req.user.id; 

  Client.deleteOne({_id:id, userId})
    .then(result => {
      res.json();
    })
    .catch(err => {
      console.log('ono, delete by id for client didn\'t work');
      next(err);
    });
});



module.exports = router; 