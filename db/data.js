'use strict';

const users = [
  {
    'id': '000000000000000000000030',
    'email': 'test@wingo.edu',
    'organizationName': 'testUser',
    'organizationPhoneNumer': '+18025055504',
    'globalHourlyRate': '20',
    'password': '$2a$10$swigcZnoxlNuqXIzKP/k1eUqKjjL02Y5FM7IUau9K75H0yXp1xp1i',
    'twilio': {
      'authToken': 'bcb71fb96c505025c24ba785f26692f3',
      'dateCreated': '2016-05-18T16:00:00Z',
      'dateUpdated': '2017-05-18T16:00:00Z',
      'accountFriendlyName': 'jsantiag@wellesley.edu',
      'sid': 'AC96d4f4dbad42367168ac2012b1430a04',
      'status': 'active',
      'phones': [
        {
          'phoneFriendlyName': 'jangles@gmail.com',
          'number': '+18026488173'
        }
      ]
    }
  }
];

const clients = [
  {
    'userId':'000000000000000000000030',
    'firstName':'jonn', 
    'lastName':'snow',
    'category':'bigBusiness',
    'addresss':{
      'streetOne':'1000 charles',
      'streetTwo':null,
      'city':'wiha',
      'state':'willinois',
      'zip': 60096
    },
    'company':'nodeitStill R us',
    'hourlyRate':'22',
    'email':'clientEmail@gmail.com',
    'phoneNumber':'+13019803889',
    'photo':'bingbing',
    'billable':true,
    'invoice':[
      {
        'month': 3,
        'year': 2018,
        'paid': true,
        'amount':8484848,
        'paidDate':'2017-07-18T16:00:00Z',
        'sentDate':'2017-05-18T16:00:00Z',
        'invoiceId': 'a101010101'
      }
    ]
  }
];

const calls = [
  {
    'id':'200000000000000000000003',
    'userSid':'AC96d4f4dbad42367168ac2012b1430a04',
    'start':'Tue, 31 Aug 2018 20:36:29 +0000',
    'end':'Tue, 31 Aug 2018 20:36:44 +0000',
    'duration':'.15',
    'organizationPhoneNumber':'+12246679955',
    'clientPhoneNumber':'+13019803889',
    'billable':true,
    'direction': 'outbound',
    'status':'active'
  }
];

module.exports = { calls, users, clients };
