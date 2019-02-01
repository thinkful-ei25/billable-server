'use strict';

const express = require('express');
const router = express.Router();
const Call = require('../models/call');
const _ = require('lodash');

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
router.get('/', (req, res, next) => {
  let userSid = req.user.twilio.sid;

  return Call.aggregate([
    {
      $match: {
        userSid: userSid  
      }
    },
    {
      $group: {
        _id: { clientId: '$id' },
        seconds: { $sum: '$duration' },
        calls: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "clients",
        localField: "_id.clientId",
        foreignField: "_id",
        as: "client"
      }
    },
    {
      $project: {
        _id: 0,
        clientId: "$_id.clientId",
        seconds: 1,
        calls: 1,
        hourlyRate: {"$arrayElemAt": ["$client.hourlyRate", 0] },
        invoiceAmount: {
          "$multiply": [
            { "$multiply": ["$seconds", .0027777] }, 
            {"$arrayElemAt": ["$client.hourlyRate", 0] } ] },
          firstName: {"$arrayElemAt": ["$client.firstName", 0] },
          lastName: {"$arrayElemAt": ["$client.lastName", 0] },
          company:  {"$arrayElemAt": ["$client.company", 0] },
      }
    }
  ]).then(basicInvoice => { 

    res
    .json(basicInvoice)
    .end();   

  }).catch(err => { 
    console.log('err', err); 
  });
}); 

module.exports = router;


