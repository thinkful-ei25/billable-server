'use strict'; 

const User = require('../../models/user'); 
const Client = require('../../models/client'); 

function findClients(twilioNumberCalled){ 

  return User.find({ 'twilio.phones.number': twilioNumberCalled })
    .then(([user]) => {
      let userId = user.id;
      return Client.find({ userId }, { _id: 0, phoneNumber: 1 });
    }).then(clients => { 
      return clients; 
    });

}

module.exports = findClients; 