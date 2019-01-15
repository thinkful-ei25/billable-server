'use strict'; 

const users=[
  {
    'id':'000000000000000000000000',
    'email':'jsantiag@wellesley.edu',
    'organizationName':'jsantiag Inc',
    'globalHourlyRate':'20',
    'password':'$2a$10$swigcZnoxlNuqXIzKP/k1eUqKjjL02Y5FM7IUau9K75H0yXp1xp1i',
    'twilio': {
      'authToken':'bcb71fb96c505025c24ba785f26692fd', 
      'dateCreated':'2016-05-18T16:00:00Z',
      'dateUpdated':'2017-05-18T16:00:00Z',
      'accountFriendlyName':'jsantiag@wellesley.edu', 
      'sid':'AC96d4f4dbad42367168ac2012b1430a0d',
      'status':'active', 
      'phones':[{
        'sid':{
          'phoneFriendlyName':'jangles@gmail.com', 
          'number':'+141586753096'
        } 
      }]
    }
  }

];

const clients=[
  {
    'userId':'000000000000000000000000',
    'clientId':'200000000000000000000000',
    'company':'nodeitall R us',
    'hourlyRate':'22',
    'phoneNumber':'+141586753099',
    'invoice':[
      {
        'month':2,
        'year':2017,
        'paid': false
      }
    ]
  }, 
  {
    'userId':'000000000000000000000000',
    'clientId':'200000000000000000000001',
    'company':'nodeitStill R us',
    'hourlyRate':'22',
    'phoneNumber':'+141586753199',
    'invoice':[
      {
        'month':3,
        'year':2018,
        'paid': true
      }
    ]
  }

];

const calls=[
  {
    '_id':'200000000000000000000001',
    'start':'Tue, 31 Aug 2018 20:36:29 +0000',
    'end':'Tue, 31 Aug 2018 20:36:44 +0000',
    'phoneNumber':'+12246679955',
    'rating': 4,
    'billable':1938
  },
  {
    '_id':'200000000000000000000000',
    'start':'Tue, 21 Aug 2018 20:36:29 +0000',
    'end':'Tue, 21 Aug 2018 20:36:44 +0000',
    'phoneNumber':'+12243567765',
    'rating': 3,
    'billable': 3
  }

]; 


module.exports = {calls, users, clients }; 

