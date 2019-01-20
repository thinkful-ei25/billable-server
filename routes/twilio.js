'use strict';
//TODO: May need to move this file to different folder as it's not a route.

const { TWILIO_APP_SID, TWILIO_NUMBER } = require('../config');
const User = require('../models/user');
const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;

module.exports = {
  /**
   * Create outgoing call capability
   * @returns {string} token
   */

  token: (accountSid, authToken) => {

    const capability = new ClientCapability({
      accountSid: accountSid,
      authToken: authToken
    });

    capability.addScope(
      new ClientCapability.OutgoingClientScope({
        applicationSid: TWILIO_APP_SID}));
        
    return capability.toJwt();
  },

  inboundToken: () => { 

     // let clientName = (page == "/dashboard"? "client" : "uknown");

    capability.addScope(
      new ClientCapability.IncomingClientScope('client')); 

    return capability.toJwt();
  }, 

  /**
   * Create TwiML for Browser Call
   * @param toCallNumber number to be called
   * @returns {string} TwiML describing the outgoing call
   *
   * TODO: Discuss how to capture callerId;
   */

  browser: toCallNumber => {
    const voiceResponse = new VoiceResponse();
    voiceResponse.dial(
      {
        callerId: TWILIO_NUMBER
      },
      toCallNumber
    );
    return voiceResponse.toString();
  },

  /**
   * Create TwiML to collect user input and call input
   * @param toCallNumber number to be called
   * @returns {string} TwiML describing the outgoing call
   *
   * TODO: Review if we can consolidate with browser above.
   * TODO: Discuss how to capture callerId.
   *
   */

  gather: toCallNumber => {
    const voiceResponse = new VoiceResponse();
    voiceResponse.dial(
      {
        callerId: TWILIO_NUMBER
      },
      toCallNumber
    );
    return voiceResponse.toString();
  },

  /**
   * Possible other TwiML Creators for inbound call and for sub-account creation. @client could replace the createSubAccountClient.
   * @param
   * @returns
   *
   * TODO: Determine if inbound can be used on the /call/inbound route
   * TODO: Determine if we could use client to replace our method for createSubAccountClient
   *
   */

  inbound: typeOfCaller => { 
    const voiceResponse = new VoiceResponse(); 

    voiceResponce.dial.client(typeOfCaller); 
  },

  /**
   * Version One: Creates a client capability for either Master or a SubAccount
   * @param accountSid
   * @param authToken
   * @returns {string} token
   *
   * TODO: Determine if we could use client to replace our method for createSubAccountClient
   *
   */

  client: (accountSid, authToken) => {
    const capability = new ClientCapability({
      accountSid: accountSid,
      authToken: authToken
    });

    return capability.toJwt();
  },

  /**
   * Version Two: Creates a client capability for either Master or a SubAccount
   * @param organizationName
   * @returns {string} capability
   *
   * TODO: Determine if we could use client to replace our method for createSubAccountClient
   * TODO: Determine if V1 or V2 solves our needs.
   * TODO: Added master organization to be able to update sub or master
   */

  client_two: (organizationName) => {
    return User.findOne({organizationName})
      .then(user => {
        console.log('##### client_two user sid ##### ' + user.twilio.sid);
        console.log('##### client_two user authToken ##### ' + user.twilio.authToken);
        const capability = new ClientCapability({accountSid: user.twilio.sid, authToken: user.twilio.authToken});
        return capability;
      })
      .catch(err => {
        console.log('#### client_two error #### ' + err);
      })
  }
};
