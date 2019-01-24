const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Client = require('../models/client');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const createSubAccountClient = require('../utils/createSubAccountClient');
const momentJs = require('moment');
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_APP_SID,
  TWILIO_NUMBER,
  MASTER_CLIENT,
  JIM
} = require('../config');
const twilio = require('../utils/twilio');

/**
 * @api [post] /call-log/status Handles updating call db once a status has changed.
 * @apiName Call Status Update
 * @apiGroup Call Log
 *
 * TODO: 
 */


 function totalsPromise(firstDay, lastDay) {
  return Call.aggregate([
    {
      $match: {
        startTime: {
          $lte: new Date(lastDay),
          $gte: new Date(firstDay)
        }
      }
    },
    {
      $group: {
        _id
      }
    }
  ])
 }


router.get('/call/info', (req, res) => {

  let userSid = req.user.userSid;
    return Calls.aggregate([
      {
        $match: {
          userSid: userSid
        }
      },
      {
        $group: {
          _id: null,
          minutes: { $sum: '$duration'},
          calls: { $sum: 1}
        } 
      }
    ])

});

/**
 * @api [post] /call-log/find
 * @apiName Call Status Update
 * @apiGroup Call Log
 *
 *
 */



/**
* @api [get] /call-log/find returns all calls associated to a User
* @apiName Call Status Update
* @apiGroup Call Log
*
* TODO: Setup route to be authenticated
* TODO: Use user to setup twilio credentials
*/



module.exports = router;

/**a
 * 3.) Setup route for dashboard home
 *     Response:
 *       {
 *         totalMinutes: Num
 *         totalCalls: Num
 *         minutesArry: []
 *         callsArray: []
 *       }
 * 4.) Setup route for all calls
 *    query: for individual contact or all
 *     Response:
 *       {
 *         Contact:
 *         Start Time:
 *         Direction: (Inbound or outbound)
 *         Length: seconds
 *         Estimated Billing:
 *         Billable: Default True
 *        }
 * 5.) Setup route for all calls by user
 *     Response:
 *        {
 *          Contact Name:
 *          Company:
 *          Phone Number:
 *          Category:
 *          Total Minutes:
 *          Total Calls:
 *          Total Cost:
 *        }
 *
 *
 */






