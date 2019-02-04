'use strict'; 
const express = require('express'); 
const router = express.Router(); 
const Client = require('../models/client'); 
const findClient = require('../utils/queries/findClients'); 



//CREATE NEW CLIENT
router.post('/', (req, res) => {
  console.log('req.body', req.body);
  const userId = req.user.id; 
  const {firstName,company, lastName, hourlyRate, phoneNumber, category, email, streetOne, streetTwo, city, state, zip, photo64} = req.body;
  console.log(photo64);
  const clientNumber = '+1' + phoneNumber.replace(/-/g, '');
  const newClient = {company,userId, firstName, lastName, hourlyRate, phoneNumber: clientNumber, category, email, 
    address:  {streetOne, streetTwo, city, state, zip}, photo: photo64
  }; 

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

//TODO: fix route name (remove hello);
router.get('/contacts/:id', (req, res, next) => {
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

/**
 * finds a client in a user's contact based on phonenumber
 * user to display client picture durring an incoming call
 */
router.get('/contacts/phone/:phoneNumber', (req, res, next) => { 
  const callerNumber = '+1' + req.params.phoneNumber; 
  const twilioNumber = req.user.twilio.phones[0].number; 

  findClient(twilioNumber, callerNumber)
    .then(client => { 

      res
        .json(client[0]); 
    })
    .catch(err => { 
      console.log('err', err); 
    }); 
}); 

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id; 

  const toUpdate = {};
  const updateableFields = ['company', 'firstName', 'lastName', 'hourlyRate', 'phoneNumber', 'category', 'email', 'streetOne', 'streetTwo', 'city', 'state', 'zip'];

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
        .sendStatus(204); 
    })
    .catch(err => {
      console.log('delete by id for client didn\'t work', err);
      next(err);
    });
});

function formatClientData(clients) {
  for(let i = 0; i < clients.length; i++) {
    let client = clients[i];
    let billed = 0;
    let unpaid = 0;
    client.invoice.map(invoice => {
      billed += invoice.amount;
      unpaid += (invoice.paid) ? 0 : invoice.amount;
    });
    client['billed'] = billed;
    client['unpaid'] = unpaid;
  }
  return clients;
}


//GET All Contacts
//TODO: Update name
//TODO: Update with authentication
router.get('/contacts', (req, res, next) => {
  const userId = req.user.id;
  Client.find({userId})
    .then(clients => {
      console.log(clients);
      return formatClientData(clients);
    } ).then(clientData => {
      if (clientData) {
        res.json(clientData);
      } else {
        next();
      }
    }).catch(err => {
      next(err);
    });
});





module.exports = router; 


