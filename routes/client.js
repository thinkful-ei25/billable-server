'use strict'; 
const express = require('express'); 
const router = express.Router(); 
const Client = require('../models/client'); 





//CREATE NEW CLIENT
router.post('/', (req, res) => {
  console.log('req.body', req.body)
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
      res
        .status(200)
        .json(result);

    })
    .catch(err => {
      console.log('ono, findbyId for client didn\'t work');
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id; 

  const toUpdate = {};
  const updateableFields = ['company', 'firstName', 'lastName', 'hourlyRate', 'phoneNumber' ];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Client.findOneAndUpdate({_id: id, userId}, toUpdate, { new: true })
    .then(result => {
      if (result) {
        res
          .json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});



router.delete('/:id', (req, res, next) => {
  const {id} = req.params; 
  const userId = req.user.id; 

  Client.findOneAndRemove({_id:id, userId})
    .then(() => {
      res
      .sendStatus(204) 
    })
    .catch(err => {
      console.log('delete by id for client didn\'t work', err);
      next(err);
    });
});





module.exports = router; 
