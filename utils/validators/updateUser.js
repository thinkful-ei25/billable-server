'use strict'; 

function validateUserUpdate(req){ 
  return new Promise(function(resolve, reject) { 

    const acceptedFields = ['organizationPhoneNumber', 'email', 'password', 'globalHourlyRate']; 
    const unknownField = req.body.find(field => !(field in acceptedFields)); 
  
    if (unknownField) { 
      const err = new Error(`unknown field '${unknownField}' in request body`);
      err.status = 422;
      reject(err);
    }
  
    const stringFields = ['organizationPhoneNumber', 'password', 'email']; 
    const numField = 'globalHourlyRate'; 
    const nonStringField = stringFields.find(field => (field in req.body && typeof field !== 'string')); 
  
    if (nonStringField) { 
      const err = new Error(`Field: '${nonStringField}' must be type String`);
      err.status = 422;
      reject(err);
    }

    if(typeof numField !== 'number'){
      const err = new Error(`Field: '${numField} must be type number`);
      err.status = 422; 
      reject(err); 
    }
  
    const explicityTrimmedFields = ['password', 'email'];
    const nonTrimmedField = explicityTrimmedFields.find(
      field => req.body[field].trim() !== req.body[field]
    );
  
    if (nonTrimmedField) {
      error.status = 422;
      reject(error);
    }
  
    const sizedFields = {
      organizationName: { min: 1 },
      password: { min: 8, max: 72 }
    };
  
    const tooSmallField = Object.keys(sizedFields).find(
      field => 'min' in sizedFields[field] &&
        req.body[field].trim().length < sizedFields[field].min
    );
    if (tooSmallField) {
      const min = sizedFields[tooSmallField].min;
      const err = new Error(`Field: '${tooSmallField}' must be at least ${min} characters long`);
      err.status = 422;
      reject(err);
    }
  
    const tooLargeField = Object.keys(sizedFields).find(
      field => 'max' in sizedFields[field] &&
        req.body[field].trim().length > sizedFields[field].max
    );
  
    if (tooLargeField) {
      const max = sizedFields[tooLargeField].max;
      const err = new Error(`Field: '${tooLargeField}' must be at most ${max} characters long`);
      err.status = 422;
      reject(err);

    }
    let { password, organizationPhoneNumber, email, globalHourlyRate } = req.body; 
    let userUpdate = {password, organizationPhoneNumber, email, globalHourlyRate }; 
    resolve(userUpdate); 
  }); 
 
}

module.exports = validateUserUpdate; 