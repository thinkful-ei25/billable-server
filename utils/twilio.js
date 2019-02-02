'use strict';
const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;

module.exports = {
  /**
   * Creates outgoing and incoming client scope for Browser Dialing.
   * @param accountSid the sid associated the with user.
   * @param authToken the token associated with the user.
   * @param organizationName the name of the organization to create client capability.
   *
   * @returns {string} clientcapability token
   */

  token: (accountSid, authToken, organizationName, appSid) => {
    const capability = new ClientCapability({
      accountSid: accountSid,
      authToken: authToken
    });

    const organizationNameNoSpaces = organizationName.replace(/ /g, '');

    capability.addScope(
      new ClientCapability.OutgoingClientScope({
        applicationSid: appSid
      })
    );

    capability.addScope(
      new ClientCapability.IncomingClientScope(organizationNameNoSpaces)
    );

    return capability.toJwt();
  },

  /**
   * Create TwiML for Outbound Browser Call
   * @param toCallNumber number to be called
   * @returns {string} TwiML describing the outgoing call
   */
  outboundBrowser: (
    toCallNumber,
    clientId,
    organizationPhoneNumber,
    twilioNumber
  ) => {
    const voiceResponse = new VoiceResponse();
    voiceResponse.dial(
      {
        answerOnBridge: true,
        callerId: twilioNumber,
        action: `/api/call/events/outbound/${clientId}/${toCallNumber}`
      },
      toCallNumber
    );
    return voiceResponse.toString();
  },

  /**
   * Create TwiML for inbound calls to the browser
   * @param organizationName user's organization name
   * @param callerId user's number
   * @returns {string} TwiML describing the outgoing call
   *
   */
  inboundBrowser: (
    organizationName,
    callerId,
    clientId,
    organizationPhoneNumber
  ) => {
    const voiceResponse = new VoiceResponse();
    let dial = voiceResponse.dial({
      callerId: callerId.slice(2),
      action: `/api/call/events/inbound/${clientId}/${organizationPhoneNumber.slice(
        -10)}`,
    });
    const organizationNameNoSpaces = organizationName.replace(/ /g, '');
    dial.client(organizationNameNoSpaces);
    return voiceResponse.toString();
  },

  /**
   * Collects input when user calls their own Twilio Number and
   * directs call to /call/inbound/gather once digits have been gathered.
   */
  gather: () => {
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

  /**
   * Handles the hangup when the Recipient of the phone call hangs up first.
   * Called by /call/events
   * @returns {string} TwiML for hanging up the call.
   */

  hangup: () => {
    console.log('HANGUP');
    const response = new VoiceResponse();
    response.hangup();
    return response.toString();
  },

  /**
   * Verifies the caller is allowed through & directs the call accordingly.
   * Called by /calls/inbound
   *
   * @param client the client/contact calling the Twilio Number.
   * @param callerNumber the number calling the Twilio Number.
   * @param organizationPhoneNumber the number of the user connected to the Twilio Account.
   *
   * @returns {string} If allowed through returns TwiML to connect caller to User
   * @return {string} If not allowed through returns TwiML saying they are not allowed.
   */

  phoneIncoming: (client, callerNumber, organizationPhoneNumber) => {
    let allowedThrough;
    const voiceResponse = new VoiceResponse();
    let clientId = client[0]._id;
    // let allowedThrough = (client.length === 1);
    allowedThrough = true;
    if (allowedThrough) {
      voiceResponse.dial(
        {
          callerId: callerNumber,
          action: `/api/call/events/inbound/${clientId}/${organizationPhoneNumber.slice(
            -10
          )}`
        },
        organizationPhoneNumber
      );
      return voiceResponse.toString();
    } else {
      voiceResponse.say('Sorry you are calling a restricted number.');
    }
  },

  /**
   * Creates TwiML for calling a contact/client
   * @param toCallNumber number to be called
   * @param client client being call
   * @param organizationPhoneNumebr used as the callerId
   *
   * @returns {string} TwiML describing the outgoing call
   */
  phoneOutgoing: (client, toCallNumber, organizationPhoneNumber) => {
    let clientId = client[0]._id;
    const voiceResponse = new VoiceResponse();
    voiceResponse.dial(
      {
        callerId: organizationPhoneNumber,
        action: '/api/call/events/outbound/' + clientId + '/' + toCallNumber
      },
      toCallNumber
    );
    return voiceResponse.toString();
  }
};
