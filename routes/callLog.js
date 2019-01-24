// const express = require('express');
// const router = express.Router();
// const User = require('../models/user');
// const Client = require('../models/client');
// const VoiceResponse = require('twilio').twiml.VoiceResponse;
// const createSubAccountClient = require('../utils/createSubAccountClient');
// const {
//   TWILIO_ACCOUNT_SID,
//   TWILIO_AUTH_TOKEN,
//   TWILIO_APP_SID,
//   TWILIO_NUMBER,
//   MASTER_CLIENT,
//   JIM
// } = require('../config');
// const twilio = require('./twilio');

// /**
//  * @api [post] /call-log/status Handles updating call db once a status has changed.
//  * @apiName Call Status Update
//  * @apiGroup Call Log
//  *
//  * TODO: 
//  */

// router.post('/status', (req, res) => {
//   console.log(req.body);

// });

// /**
//  * @api [post] /call-log/find
//  * @apiName Call Status Update
//  * @apiGroup Call Log
//  *
//  *
//  */

// /**
//  * @Scenario1 OrgNumber Calls Twilio (Phone)
//  *  Call #1:
//  *    -Direction: Incoming
//  *    -From: OrgNumber
//  *    -To: Twilio Number
//  *    -Type: Phone
//  *
//  *  Call #2:
//  *    -Direction: Outgoing Dial
//  *    -From: TwilioNumber
//  *    -To: ClientNumber
//  *    -Type: Phone
//  *
//  * @Scenario2 Client Number Calls Twilio (Phone)
//  *  Call #1:
//  *    -Directio: Incoming
//  *    -From: ClientNumber
//  *    -To: Twilio Number
//  *    -Type: Phone
//  *
//  *  Call #2:
//  *    -Direction: Outgoing Dial
//  *    -From: ClientNumber
//  *    -To: TwilioNumber
//  *    -Type: Phone
//  * @Scenario3 Client Number Calls Twilio (Browser)
//  *
//  * @Scenario4 TwilioNumber Calls Client (Browser)
//   *  Call #1:
//  *    -Directio: Incoming
//  *    -From: Anonymous
//  *    -To: Blank
//  *    -Type: Client
//  *
//  *  Call #2:
//  *    -Direction: Outgoing Dial
//  *    -From: TwilioNumber
//  *    -To: Client Number
//  *    -Type: Phone
//  */

// /**
//  *  Only Care about when
//  *    1. from = Twilio Number
//  *        -direction = outbound
//  *        -userPhone Number = from
//  *        - clientPhoneNumber = to
//  *    2. Client it' = from != organizationPhoneNumber && != twilio Number
//  *        -direction = inbound
//  *        - userPhone = Twilio  Number User
//  *        - clientPhone = from
//  *
//  *
//  */

// /**
//  *  if(from) !== TwilioNumber =>
//  *      direction = inbound
//  *      clientPhoneNumber = from
//  *  if(from === userPhoneNumber) {
//  *    This is the first leg of the call.
//  *    Need
//  * }
//  *
//  */



// /**
// * @api [get] /call-log/find returns all calls associated to a User
// * @apiName Call Status Update
// * @apiGroup Call Log
// *
// * TODO: Setup route to be authenticated
// * TODO: Use user to setup twilio credentials
// */


// router.get('/find', (req, res) => {
//   let { organizationName } = req.body;
//   let callsArr = [];
//   let callInfo;
//   let direction = '';
//   let userPhoneNumber = '';
//   let clientPhoneNumber = '';
//   let userCalls;
//   let userSid;
//   User.find({ organizationName: organizationName })
//     .then(([user]) => {
//       userCalls = user;
//       userSid = user.twilio.sid;
//       userPhoneNumber = user.organizationPhoneNumber;
//       twilioNumber = user.twilio.phones.number;
//     })
//     .then(() => {;
//       return JIM.calls
//         .list({
//           accountSID: userSid,
//           status: 'completed'
//         })
//     }).then((calls)
//       //for each call, query the clients db and return that id;
//     )
//     .then(calls => {
//       console.log(calls);
//       return calls.map(call => {
//         return {
//           id: 
//           start: call.startTime,
//           end: call.endTime,
//           duration: call.duration,
//           userPhoneNumber: TWILIO_NUMBER,
//           clientPhoneNumber: '3019803889',
//           callSid: call.sid,
//           billable: true,
//           direction: call.direction,
//           status: call.status
//         };
//       });
//     })
//     .then()
//     .then(call => {
//       res.status(201);
//       res.json(call);
//     });
// });

// module.exports = router;

// /**
//  * 1.) Seed DB with existing call data
//  * 2.) Setup a statusURL to tell Twilio what to do when a status changes aka on complete
//  * 3.) Setup route for dashboard home
//  *     Response:
//  *       {
//  *         totalMinutes: Num
//  *         totalCalls: Num
//  *         minutesArry: []
//  *         callsArray: []
//  *       }
//  * 4.) Setup route for all calls
//  *    query: for individual contact or all
//  *     Response:
//  *       {
//  *         Contact:
//  *         Start Time:
//  *         Direction: (Inbound or outbound)
//  *         Length: seconds
//  *         Estimated Billing:
//  *         Billable: Default True
//  *        }
//  * 5.) Setup route for all calls by user
//  *     Response:
//  *        {
//  *          Contact Name:
//  *          Company:
//  *          Phone Number:
//  *          Category:
//  *          Total Minutes:
//  *          Total Calls:
//  *          Total Cost:
//  *        }
//  *
//  *
//  */

