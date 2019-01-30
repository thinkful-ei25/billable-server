'use strict';

const express = require('express');
const router = express.Router();
const Call = require('../models/call');
const _ = require('lodash');



function createSeries(results) {
  let durationArr = [];
  let callsArr = [];
  let datesArr = [];
  let durationTotal = 0;
  let callsTotal = 0;
  for (let i = 0; i < results.length; i++) {
    console.log(results);
    datesArr.push(results[i]._id);
    durationArr.push(results[i].seconds);
    callsArr.push(results[i].calls);
    durationTotal += results[i].seconds;
    callsTotal += results[i].calls;
  }
  return { datesArr, durationArr, callsArr, durationTotal, callsTotal };
}

/**
 * @api [get] invoices Returns an object to display all invoices grouped by project
 * @apiName All Invoices
 * @apiGroup Invoices
 * 
 * @page used on the user dashboard upon login.
 *
 * @apiParam userSid {string} From Req.User
 *
 *
 */

 function formateInvoices(data){
  let groupedInvoices = _.groupBy(data, (client) => {
    return client.clientId
  })
  console.log(groupedInvoices);
  return groupedInvoices;
   }
 

// Contact Name
// # of Calls
// # of Minutes
// Total invoiced
// Total Uninvoiced
// Send

router.get('/', (req, res, next) => {
  let userSid = req.user.twilio.sid;
  let { clientId } = req.params;

  if(clientId) {
    //go to that query
  } else {
    // go to that query
  }
return Call.aggregate([
      {
        $match: {
          userSid: userSid
        }
      },
      {
        $group: {
          _id: { clientId: '$id', invoiced: '$invoiced' },
          seconds: { $sum: '$duration' },
          calls: { $sum: 1 }
        }
      },
  {
    $sort: {
      '_id.clientId': -1
    }
  },
  {
    $project: {
      _id: 0,
      clientId: "$_id.clientId",
      invoiced: "$_id.invoiced",
      seconds: 1,
      calls: 1
    }
  }
    ])
    .then(result => {
      if (!result) {
        const err = new Error('No Call Results Found');
        err.status(400);
        next();
      } else {
        return formateInvoices(result);
        // return result;
      }
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
});

// /**
//  * @api [post] /call-log/find
//  * @apiName Call Status Update
//  * @apiGroup Call Log
//  *
//  *
//  */

// //TODO: FORMATE DURATION WITH MOMENTJS

// function formatIndClientCalls(calls) {
//   return calls.map(call => {
//     let durationMin = call.duration > 60 ? call.duration / 60 : 0;
//     let estimatedBilling =
//       durationMin > 0 ? call.id.hourlyRate * (durationMin / 60) : 0;
//     return {
//       date: call.startTime,
//       direction: call.direction,
//       length: durationMin,
//       billable: call.billable,
//       estimatedBilling
//     };
//   });
// }

// function formatAllClientCalls(calls) {
//   return calls.map(call => {
//     let client = call.id;
//     let durationMin = call.duration > 60 ? call.duration / 60 : 0;
//     let estimatedBilling =
//       durationMin > 0 ? call.id.hourlyRate * (durationMin / 60) : 0;
//     return {
//       date: call.startTime,
//       direction: call.direction,
//       photo: client.photo || null,
//       contactName: `${client.firstName} ${client.lastName}`,
//       company: client.company,
//       phoneNumber: client.phoneNumber,
//       length: durationMin,
//       billable: call.billable,
//       estimatedBilling
//     };
//   });
// }

// /**
//  * @api [get] /call/stats/:userSid Used to return All Call Data or Specific Client Data
//  * @apiName Client Call Data
//  * @apiGroup Call Stats
//  *
//  * @page Calls and/or Specific Client Page
//  *
//  * @apiParam userSid {string} Send back with Fetch to identify the user
//  * @apiQuery clientId {string} Used when asking for specific client call data/
//  *
//  *
//  * TODO: Authenticate Route, and update userSid to come from req.body.
//  */

// router.get('/stats/:userSid/', (req, res, next) => {
//   // let {limit} = req.query
//   // let userSid = req.user.userSid;
//   let { clientId } = req.query;
//   let { userSid } = req.params;

//   if (clientId && userSid) {
//     return Call.find({ id: clientId, userSid })
//       .populate('id')
//       .then(calls => {
//         if (calls) {
//           return formatIndClientCalls(calls);
//         } else {
//           next();
//         }
//       })
//       .then(callsArr => {
//         res.json(callsArr);
//       })
//       .catch(err => {
//         next(err);
//       });
//   } else if (!clientId && userSid) {
//     return Call.find({ userSid })
//       .populate('id')
//       .then(calls => {
//         if (calls) {
//           return formatAllClientCalls(calls);
//         } else {
//           next();
//         }
//       })
//       .then(callsArr => {
//         res.json(callsArr);
//       })
//       .catch(err => {
//         next(err);
//       });
//   }
// });

module.exports = router;



// Call 1: 60 minutes
// Call 2: 30 Minutes
// Call 3: 30 Minutes

// Total Calls: 3
// Total minute: 120
// Total Billed: 0
// Total Unpaid: $120
// Rate: $20
// Button: Send

// Invoice 1: Call 1,2,3 would get packaged up and placed into invoices

// Call 4: 30 minutes
// Call 5:  30 minutes

// Total Calls: 5
// Total Minutes: 180
// Total Billed: $120
// Total Unpaid: $180

// Send Invoice:

// Invoice 2: Call 4, 5



// Call Finishes:

// Find contact
// Month of Start Date:

// Update Contact.invoice {
//   Week: 
//   Month: Month,
//   Amount += const
//   year: year,
//   paid: false,
//   paidDate: null,
//   sentDate: null,
//   invoiceId: 
// }


// Send Invoice
// Marked as paid
//   Calls in that invoice and mark them as invoiceId



// Invoice Page:

// Contact Name
// # of Calls
// # of Minutes
// Total invoiced
// Total Uninvoiced
// Send

// Click Send => All calls invoiced ==== false


// Invoice Route

// Get Invoices:
// All CallStats by Client Id

// Send Invoice
// ClientId: 
//   send all non-invoiced calls


