'use strict';

const express = require('express');
const router = express.Router();
const Call = require('../models/call');

function createSeries(results) {
  let durationArr = [];
  let callsArr = [];
  let datesArr = [];
  let durationTotal = 0;
  let callsTotal = 0;
  for (let i = 0; i < results.length; i++) {
    datesArr.push(results[i]._id);
    durationArr.push(results[i].seconds);
    callsArr.push(results[i].calls);
    durationTotal += results[i].seconds;
    callsTotal += results[i].calls;
  }
  return { datesArr, durationArr, callsArr, durationTotal, callsTotal };
}

/**
 * @api [get] call/stats/all Returns an object to display aggregate call and time data for dashboard.
 * @apiName All Call Stats
 * @apiGroup Call Stats
 *
 * @page used on the user dashboard upon login.
 *
 * @apiParam userSid {string} From Req.User
 *
 *
 * TODO: Update API Doc to include route.
 * TODO: Authenticate Route, and update userSid to come from req.body.
 * TODO: Incorporate Invoice amount billed and new contact or update UI not to include it.
 */

router.get('/stats/all', (req, res, next) => {
  let userSid = req.user.twilio.sid;
  return Call.aggregate([
    {
      $match: {
        userSid: userSid
      }
    },
    {
      $project: {
        moment: {
          $dateToString: { format: '%m-%d-%Y', date: '$startTime' }
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

//TODO: FORMATE DURATION WITH MOMENTJS

function formatIndClientCalls(calls) {
  return calls.map(call => {
    let durationMin = call.duration > 60 ? call.duration / 60 : 0;
    let estimatedBilling =
      durationMin > 0 ? call.id.hourlyRate * (durationMin / 60) : 0;
    return {
      date: call.startTime,
      direction: call.direction,
      length: durationMin,
      billable: call.billable,
      estimatedBilling
    };
  });
}

function formatAllClientCalls(calls) {
  let durationMin;
  let estimatedBilling;
  return calls.filter(call => {
    return call.id !== null;
  }).map(call => {
    let client = call.id;
    if (client) {
      durationMin = call.duration > 60 ? call.duration / 60 : 0;
      estimatedBilling =
        durationMin > 0 ? call.id.hourlyRate * (durationMin / 60) : 0;
    } else {
      durationMin = 0;
      estimatedBilling = 0;
    }
    return {
      date: call.startTime,
      direction: call.direction,
      photo: client ? client.photo : 'deleted',
      contactName: client
        ? `${client.firstName} ${client.lastName}`
        : 'deleted',
      company: client ? client.company : 'deleted',
      phoneNumber: client ? client.phoneNumber : 'deleted',
      length: durationMin,
      billable: call.billable,
      estimatedBilling
    };
  });
}

/**
 * @api [get] /call/stats/:userSid Used to return All Call Data or Specific Client Data
 * @apiName Client Call Data
 * @apiGroup Call Stats
 *
 * @page Calls and/or Specific Client Page
 *
 * @apiParam userSid {string} Send back with Fetch to identify the user
 * @apiQuery clientId {string} Used when asking for specific client call data/
 *
 *
 * TODO: Authenticate Route, and update userSid to come from req.body.
 */
router.get('/calls/:clientId', (req, res, next) => {
  let { clientId } = req.params;
  let userSid = req.user.twilio.sid;
  return Call.find({ id: clientId, userSid })
    .populate('id')
    .then(calls => {
      if (calls) {
        return formatIndClientCalls(calls);
      } else {
        next();
      }
    })
    .then(callsArr => {
      res.json(callsArr);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/calls', (req, res, next) => {
  let userSid = req.user.twilio.sid;
  //console.log('USERSID => ', userSid);
  return Call.find({ userSid })
    .populate('id')
    .then(calls => {
      //console.log(calls);
      if (calls) {
        return formatAllClientCalls(calls);
      } else {
        next();
      }
    })
    .then(callsArr => {
      //console.log(callsArr)
      res.json(callsArr);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
