'use strict';

const users = [
  {
    'id': '',
    'email': '',
    'organizationName': 'testUser',
    'organizationPhoneNumer': '',
    'globalHourlyRate': '20',
    'password': '$2a$10$swigcZnoxlNuqXIzKP/k1eUqKjjL02Y5FM7IUau9K75H0yXp1xp1i',
    'twilio': {
      'authToken': '',
      'dateCreated': '2016-05-18T16:00:00Z',
      'dateUpdated': '2017-05-18T16:00:00Z',
      'accountFriendlyName': '',
      'sid': '',
      'status': 'active',
      'phones': [
        {
          'phoneFriendlyName': '',
          'number': ''
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
    'phoneNumber':'',
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
    'userSid':'',
    'start':'Tue, 31 Aug 2018 20:36:29 +0000',
    'end':'Tue, 31 Aug 2018 20:36:44 +0000',
    'duration':'.15',
    'organizationPhoneNumber':'',
    'clientPhoneNumber':'',
    'billable':true,
    'direction': 'outbound',
    'status':'active'
  }
];

module.exports = { calls, users, clients };
