const express = require('express'); 
const router = express.Router(); 
const {TWILIO_ACCOUNT_SID,  TWILIO_AUTH_TOKEN} = require('../config'); 
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
// console.log('client', client);  
let number; 

router.post('/users', (req, res) => { 
  console.log('CREATE A NEW USER'); 
  client.api.accounts.create({friendlyName: 'Brady Fox'})
    .then(account => { 
      console.log(account); 
      res.end(); 
    })
    .done(); 
}); 

router.get('/users', (req, res) => { 
  console.log('GET A PRE-EXISTING USER'); 
  const accountSid = 'AC5ad320be60c4f745deea8e44f06b8906'; 

  client.api.accounts(accountSid)
    .fetch()
    .then(account => { 
      console.log(account); 
      res.json(account); 
    })
    .done();
}); 

router.delete('/users', (req, res) => { 
  //TODO
}); 

router.put('/users', (req, res) => { 
  //TODO
}); 

router.get('/phone/search', (req, res) => { 
  console.log('FIND AVAILABLE LOCAL PHONE NUMBERS'); 
  const areaCode = '802'; 
  client
  .availablePhoneNumbers('US')
  .local.list({
    areaCode
  })
  .then(availableNumbers => {
    console.log('availableNumbers', availableNumbers, 'length', availableNumbers.length)
    number = availableNumbers[0].phoneNumber;
    console.log('number', number); 
    res.json(number); 
  }); 
  
}); 

router.post('/phone', (req, res) => { 
  console.log('CREATE A NEW PHONE NUMBER'); 
  console.log('number', number); 
  client.incomingPhoneNumbers.create({
      phoneNumber: number,
  })
  .then(createdPhoneNumber => { 
    console.log('phone', createdPhoneNumber); 
    res.end(); 
  })
  .catch(err => { 
    console.log('POST /api/phone', error); 
  }); 
}); 

router.put('/phone', (req, res) => { 
  console.log('UPDATE A PREXISTING PHONE NUMBER'); 

}); 




module.exports = router; 