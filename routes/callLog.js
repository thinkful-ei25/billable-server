const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Client = require('../models/client');
const Call = require('../models/call');
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

function createSeries(results) {
  let durationArr = [];
  let callsArr = [];
  let durationTotal = 0;
  let callsTotal = 0;
  for (let i = 0; i < results.length; i++) {
    durationArr.push(results[i].seconds);
    callsArr.push(results[i].calls);
    durationTotal += results[i].seconds;
    callsTotal += results[i].calls;
  }
  return { durationArr, callsArr, durationTotal, callsTotal };
}

/**
 * @api [get] call/stats/all Returns an object to display aggregate call and time data for dashboard.
 * @apiName All Call Stats
 * @apiGroup Call Stats
 * 
 * @apiParam userSid {string} From Req.User 
 * 
 *
 * TODO: Update API Doc to include route.
 * TODO: Authenticate Route, and update userSid to come from req.body.
 */

router.get('/stats/all', (req, res, next) => {
  // let userSid = req.user.userSid;
  let { userSid } = req.body;
  console.log(userSid);
  return Call.aggregate([
    {
      $match: {
        userSid: userSid
      }
    },
    {
      $project: {
        moment: {
          $dateToString: { format: '%Y-%d', date: '$startTime' }
        },
        duration: '$duration'
      }
    },
    {
      $group: {
        _id: '$moment',
        seconds: { $sum: '$duration' },
        calls: { $sum: 1 }
      }
    },
    {
      $sort: {
        _id: -1
      }
    }
  ])
    .then(result => {
      console.log('RESULT => ', result);
      if (!result) {
        const err = new Error('No Call Results Found');
        err.status(400);
        next();
      } else {
        return createSeries(result);
      }
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
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
