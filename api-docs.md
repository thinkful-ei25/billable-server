# Billable API
## USER
### POST /api/register/users
Purpose: Create a new user (register) 

Example: POST https://example.com/api/register/user

Place: Registration page

Request body:
```
{
  "organizationName": "google", 
  "email": "joe@brosef.com",
  "password": "correct-horse-battery-staple"
}
```

Response body: 
```

  {
    "organizationName": "Elon Musk's Mighty Devils",
    "password": "$2a$10$uN2lH0tpxKbsVVejH2Ft/enGw87FOjUc6bDzThQ56PV2Ln1TtjO1W",
    "email": "muskyhusk@tesla.com",
    "twilio": {
        "sid": "AC301ed9287eaf02c492252079afb2e4dc",
        "authToken": "936452ece6fca5bfeb20f24ce74a61f1",
        "accountFriendlyName": "Elon Musk's Mighty Devils",
        "dateCreated": "2019-01-17T17:04:15.000Z",
        "dateUpdated": "2019-01-17T17:04:15.000Z",
        "status": "active",
        "phones": []
    }
}

```

[Twilio Return User]:https://www.twilio.com/docs/iam/api/subaccounts?code-sample=code-return-a-subaccount-resource-by-its-account-sid&code-language=Node.js&code-sdk-version=3.x#authentication

### GET /api/account/user
get pre-existing subaccount/user

{
  sid: 'AC5ad320be60c4f745deea8e44f0888906"
}

Response Body 

{
  "user":{
    'id':'000000000000000000000000',
    'email':'jsantiag@wellesley.edu',
    'organizationPhoneNumber': '+18483829299',
    'organizationName':'jsantiag Inc',
    'globalHourlyRate':'20',
    'password':'$2a$10$swigcZnoxlNuqXIzKP/k1eUqKjjL02Y5FM7IUau9K75H0yXp1xp1i',
    'twilio': {
      'authToken':'bcb71fb96c505025c24ba785f26692fd', 
      'dateCreated':'2016-05-18T16:00:00Z',
      'dateUpdated':'2017-05-18T16:00:00Z',
      'accountFriendlyName':'jsantiag@wumbo.edu', 
      'sid':'AC96d4f4dbad42367168ac2012b1430a0d',
      'status':'active', 
      'phones':[
        {
          'phoneFriendlyName':'jangles@gmail.com', 
          'number':'+141586753096'
        } 
      ]
    }
  }
 }
}

### PUT /api/account/user/:status
Purpose: Update user status to active or suspended

Place: Settings page

Request body:
```
Params: {"status":"active" || "suspended" || closed}

{
  "email":"jangles@gmail.com",
  "twilio": { 
      "sid": "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  }
}
```
Response body: 
```
{
  "code": "201",
}
```

### DELETE /api/user

### POST /api/login 

Request body: 
```
{
  "organizationName": "bestOrgName",
  "password":"badPassword"
}
```
Response body:
```
{
  "authToken":"supersecrettoken"
}
```

### GET /api/register/phones
Purpose: Search for the available Twilio phone numbers

Request body: 
```
{ 
  "areaCode": "978"
}
```

Response body: 
```
{
  "+18024788199",
  "+18024788194",
  "+18024788195",
  "+18024788196",
  "+18024788197"
}
```
[Twilio Search For Phone Numbers]:https://www.twilio.com/docs/phone-numbers/api/available-phone-numbers

### POST /api/phone

Purpose: Purchase a Twilio phone number from the selected number and store their organization phone number

Request body: 
```
{ 
  "twilioPhoneNumber":"+1802397178",
  "twilioPhoneNumberName":"Jim's phone", 
  "organizationPhoneNumber":"+1802505533"
}
```

Response body: 
```
{
  "message": "A phone was created" 
}
```
NOTE: Then we will do a promise to set the orginationPhoneNumber and the twilio number to the db
[Twilio Create Phone Number]:https://www.twilio.com/docs/iam/api/subaccounts?code-sample=code-return-a-subaccount-resource-by-its-account-sid&code-language=Node.js&code-sdk-version=3.x#authentication

//FOR THIS LINE ONWARDS: NEEDS REVIEW
### POST /api/client
Purpose: Create a new client
Request body:
```
{ 
  "name":"Evil Corp", 
  "phone-number": "(666)666-6666", 
  //optional
  "hourly-rate": "20"
  //FEATURE TO ADD EMPLOYEES TO COME!
}
```

Response body:
```
{ 
  "code": "201",
  "message": "User created successfully"
}
```

### GET /api/client
Purpose: Get a pre-existing client
Request body:
```
{ 
  "client-id": "20145d3"
}
```

Response body:
```
{ 
  "name":"Evil Corp", 
  "number":"(666)666-6666,
  "calls": []
}
```

### PUT /api/client
Purpose: Update a pre-existing client
Request body:
```
{ 
  //FIELDS THAT NEED TO BE EDITED
  "name":"Bob"
  "number":"(404)-123-4567", 
  "hourly-rate":"11"
}
```

Response body:
```
{ 
  "code": "201",
  "message": "User updated successfully"
}
```

### DELETE /api/client
Purpose: Delete a pre-existing client
Request body:
```
{ 
  "client-id": "20145d3"
}
```

Response body:
```
{ 
  "code": "204",
  "message": "User successfully deleted"
}
```

### POST /api/call/inbound
Purpose: Call a client
Request body: 
"From" - the voice-enabled Twilio phone number you added to your account earlier
"To" - the person you'd like to call
"Url" - A URL that returns TwiML with instructions on what should happen when the other party picks up the phone
```
{ 
  "url": "http://billable.com/calls.xml",
  "to": "+14155551212",
  "from": "+15017122661"  
}
```
Response body: 
```
{
  "account_sid": "AC5ad320be60c4f745deea8e44f06b8906",
  "annotation": null,
  "answered_by": null,
  "api_version": "2010-04-01",
  "caller_name": null,
  "date_created": "Tue, 31 Aug 2010 20:36:28 +0000",
  "date_updated": "Tue, 31 Aug 2010 20:36:44 +0000",
  "direction": "inbound",
  "duration": "15",
  "end_time": "Tue, 31 Aug 2010 20:36:44 +0000",
  "forwarded_from": "+141586753093",
  "from": "+15017122661",
  "from_formatted": "(501) 712-2661",
  "group_sid": null,
  "parent_call_sid": null,
  "phone_number_sid": "PNXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "price": -0.03000,
  "price_unit": "USD",
  "sid": "CAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "start_time": "Tue, 31 Aug 2010 20:36:29 +0000",
  "status": "completed",
  "subresource_uris": {
    "notifications": "/2010-04-01/Accounts/AC5ad320be60c4f745deea8e44f06b8906/Calls/CAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Notifications.json",
    "recordings": "/2010-04-01/Accounts/AC5ad320be60c4f745deea8e44f06b8906/Calls/CAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Recordings.json",
    "feedback": "/2010-04-01/Accounts/AC5ad320be60c4f745deea8e44f06b8906/Calls/CAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Feedback.json",
    "feedback_summaries": "/2010-04-01/Accounts/AC5ad320be60c4f745deea8e44f06b8906/Calls/FeedbackSummary.json"
  },
  "to": "+14155551212",
  "to_formatted": "(415) 555-1212",
  "uri": "/2010-04-01/Accounts/AC5ad320be60c4f745deea8e44f06b8906/Calls/CAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.json"
}
```

<!-- ### POST /api/analytics
Purpose: When a call ends save metadata relating to that call

Request body: 
```
{   
  "answered_by": "Captain Morgan",
  "caller_name": "Jack Daniels",
  "date_created": "Tue, 31 Aug 2010 20:36:28 +0000",
  "date_updated": "Tue, 31 Aug 2010 20:36:44 +0000",
  "direction": "outbound",
  "duration": "15",
  "end_time": "Tue, 31 Aug 2010 20:36:44 +0000",
  "from": "+15017122661",
  "from_formatted": "(501) 712-2661",
  "price": -0.03000,
  "price_unit": "USD",
  "start_time": "Tue, 31 Aug 2010 20:36:29 +0000",
  "status": "completed",
  "to": "+14155551212",
  "to_formatted": "(415) 555-1212",
}
```
Response body: 
``` 
{
  "code": "201",
  "message": "Analytics updated successfully"
}
```

### GET /api/analytics/user
Purpose: Get analytics relating to the user

Request body: 
```
{ 
  "user-id": "2104926325"
}
```
Response body: 
``` 
{ 
  "average-time-phone-call": "10", 
  "last-call": REF-TO-CLIENT
  "total-call": 23, 
  "total-billable-time": "23", 
  "total-billed": "23,023", 
  "amount-recieve": "1", 
  "amount-owed":"21,022"
  //MORE TO COME! :)
}
```

### GET /api/analytics/client
Purpose: Get analytics relating to a specific client

Request body: 
```
{ 
  "user-id": "2104926325"
}
```

Response body: 
``` 
{ 
  "last-call": REF-TO-CALL, 
  "calls": [REF-TO-CALL], 
  "total-calls": "22", 
  "average-length-call", "9"
  //MORE TO COME! :)
}
``` -->










