'use strict';

const User = require('../../models/user');
const Client = require('../../models/client');

function findClients(twilioNumberCalled, callerNumber) {

  return User.find({ 'twilio.phones.number': twilioNumberCalled })
    .then(([user]) => {
      let userId = user._id;
      return Client.find({ userId, "phoneNumber": callerNumber });
    })
    .then(clients => {
      return clients;
    });
}

module.exports = findClients;
