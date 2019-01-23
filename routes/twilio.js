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
   * TODO: programatically determine the client scope
   */

  token: (accountSid, authToken) => {

    const capability = new ClientCapability({
      accountSid: accountSid,
      authToken: authToken
    });

    capability.addScope(
      new ClientCapability.OutgoingClientScope({
        applicationSid: TWILIO_APP_SID}));

    capability.addScope(
      new ClientCapability.IncomingClientScope('Benevolent-Nezzler')); 
    
    return capability.toJwt();
  },

  /**
   * Create TwiML for Outbound Browser Call
   * @param toCallNumber number to be called
   * @returns {string} TwiML describing the outgoing call
   *
   * TODO: Discuss how to capture callerId;
   */

  outBoundBrowser: toCallNumber => {
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
   * @param organizationName user's organization name
   * @param callerId user's number
   * @returns {string} TwiML describing the outgoing call
   *
   */
  inboundBrowser: (organizationName, callerId) => { 
    const voiceResponse = new VoiceResponse(); 
    
    let dial = voiceResponse.dial({callerId}); 
    dial.client(organizationName); 

    return voiceResponse.toString(); 
  },

  /**
   * Purpose: handle when user calls their own Twilio number (to make an outbound call)
   */
  phoneOutgoing: () => { 
    const voiceResponse = new VoiceResponse();

    const gather = voiceResponse.gather({
      numDigits: 10,
      action: '/api/call/inbound/gather',
      method: 'POST',
      finishOnKey: '#'
    });

    gather.say(
      'Enter the number you are trying to reach followed by the pound sign.'
    ); 

    return voiceResponse.toString(); 
  }, 

  phoneIncoming: (clients, callerNumber, organizationNumber) => {
    let allowedThrough; 

    const voiceResponse = new VoiceResponse();

    // let allowedCallers = clients.map(client => {
    //   client.phoneNumber;
    // });

    TODO: 
    //let allowedThrough = allowedCallers.includes(callerNumber); 
    console.log(callerNumber, organizationNumber); 

    allowedThrough = true; 
    if (allowedThrough) {
      voiceResponse.dial({ callerId: callerNumber }, organizationNumber );
      return voiceResponse.toString(); 
    } else {
      voiceResponse.say('Sorry you are calling a restricted number.'); 
      return; 
    }
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
