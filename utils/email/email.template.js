const { CLIENT_ORIGIN } = require('../../config')

// This file is exporting an Object with a single key/value pair.
// However, because this is not a part of the logic of the application
// it makes sense to abstract it to another file. Plus, it is now easily 
// extensible if the application needs to send different email templates
// (eg. unsubscribe) in the future.
module.exports = {

  confirm: (seconds, calls, hourlyRate, invoiceAmount, company, firstName, lastName) => ({
    subject: `INVOICE TO ${company}`,
    html: `
     <p>Dear ${firstName} ${lastName},</p>
     <br></br>
     <p>
      Total Calls: ${calls}, 
      Total Seconds: ${seconds} 
      Hourly Rate: ${hourlyRate}
      Invoice Amount: ${invoiceAmount}
    </p>
    `,      
    text: `Wazzup yo!`
  })
  
}; 