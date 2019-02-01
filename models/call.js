'use strict';

const mongoose = require('mongoose');

const CallSchema = mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  userSid: String,
  startTime: Date,
  endTime: Date,
  duration: { type: Number, default: 0 },
  organizationPhoneNumber: { type: String, required: true },
  clientPhoneNumber: { type: String, required: true },
  callSid: String,
  billable: { type: Boolean, default: true },
  direction: String,
  status: String,
  invoiced: Boolean
});

CallSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

const Call = mongoose.model('Call', CallSchema);

module.exports = Call;