# Billable API
## USER
### POST /api/register/users
Purpose: Create a new user (register) 

Example: POST https://example.com/api/user

Place: Registration page

Request body:
```
{
  "organizationName": "google", 
  "email": "joe@brosef.com",
  "password": "correct-horse-battery-staple", 
  "hourlyRate": "23"
}
```

Response body: 
```
{
  "code": "201",
  "message": "Registration Success",
  "bearer-token": "afahsjdl239rufadsfjlq3r09uadiosf3817098"
  "twilio": { 
      "auth_token": "auth_token",
      "date_created": "Thu, 30 Jul 2015 20:00:00 +0000",
      "date_updated": "Thu, 30 Jul 2015 20:00:00 +0000",
      "friendly_name": "Submarine+Billable",
      "sid": "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      "status": "active"
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

### POST /api/auth/login 

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
  authToken:"supersecrettoken"
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
  "message": "Search for available Twilio phone numbers was successful",
  "twilio": { 
    "uri": "\/2010-04-01\/Accounts\/AC5ad320be60c4f745deea8e44f06b8906\/AvailablePhoneNumbers\/US\/Local.json?AreaCode=510",
    "available_phone_numbers": [
      {
        "friendly_name": "(510) 564-7903",
        "phone_number": "+15105647903",
        "lata": "722",
        "rate_center": "OKLD TRNID",
        "latitude": "37.780000",
        "longitude": "-122.380000",
        "region": "CA",
        "postal_code": "94703",
        "iso_country": "US",
        "capabilities":{
          "voice": true,
          "SMS": true,
          "MMS": false
        },
        "beta": false
      },
      {
        "friendly_name": "(510) 488-4379",
        "phone_number": "+15104884379",
        "lata": "722",
        "rate_center": "OKLD FRTVL",
        "latitude": "37.780000",
        "longitude": "-122.380000",
        "region": "CA",
        "postal_code": "94602",
        "iso_country": "US",
        "capabilities":{
          "voice": true,
          "SMS": true,
          "MMS": false
        },
        "beta": false
      },
      ...
    ]
  }
}
```
[Twilio Search For Phone Numbers]:https://www.twilio.com/docs/phone-numbers/api/available-phone-numbers
### POST /api/phone

Purpose: Create a new Twilio phone number from the selected number and store their organization phone number

Request body: 
```
{ 
  "friendlyName": "Billable Line",
  "organizationPhoneNumber": "(666)420-6969",
  "phoneNumber": "+15105647903",
  "voiceMethod": "GET",
  "voiceUrl": "http://demo.twilio.com/docs/voice.xml"
}
```

Response body: 
```
{
  "code": "201", 
  "message": "Creating the Twilio phone number was successfull", 
  "twilio": { 
    "account_sid": "AC5ad320be60c4f745deea8e44f06b8906",
    "address_requirements": "none",
    "address_sid": "ADXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "api_version": "2010-04-01",
    "beta": false,
    "capabilities": {
      "mms": true,
      "sms": false,
      "voice": true
    },
    "date_created": "Thu, 30 Jul 2015 23:19:04 +0000",
    "date_updated": "Thu, 30 Jul 2015 23:19:04 +0000",
    "emergency_status": "Active",
    "emergency_address_sid": "ADXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "friendly_name": "My Company Line",
    "identity_sid": "RIXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "origin": "origin",
    "phone_number": "+15105647903",
    "sid": "PNXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "sms_application_sid": null,
    "sms_fallback_method": "POST",
    "sms_fallback_url": "",
    "sms_method": "POST",
    "sms_url": "",
    "status_callback": "",
    "status_callback_method": "POST",
    "trunk_sid": null,
    "uri": "/2010-04-       01/Accounts/AC5ad320be60c4f745deea8e44f06b8906/IncomingPhoneNumbers/PNXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.json",
    "voice_application_sid": null,
    "voice_caller_id_lookup": false,
    "voice_fallback_method": "POST",
    "voice_fallback_url": null,
    "voice_method": "GET",
    "voice_url": "http://demo.twilio.com/docs/voice.xml"
    }
  }
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










