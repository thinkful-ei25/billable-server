'use strict'; 

function validateUser(req, res){ 
  return new Promise(function(resolve, reject) { 
    const requiredFields = ['organizationName', 'email', 'hourlyRate', 'password']; 
    const missingField = requiredFields.find(field => !(field in req.body)); 
  
    if (missingField ) { 
      reject(new Error(`Missing '${missingField} in request body`)); 

    }
  
    const stringFields = ['organizationName', 'password', 'email']; 
    const nonStringField = stringFields.find(field => !(field in req.body)); 
  
    if (nonStringField) { 
      reject(new Error(`Field: '${nonStringField}' must be type String`)); 
    }
  
    const explicityTrimmedFields = ['organizationName', 'password', 'email'];
    const nonTrimmedField = explicityTrimmedFields.find(
      field => req.body[field].trim() !== req.body[field]
    );
  
    if (nonTrimmedField) {
      reject(new Error(`Field: '${nonTrimmedField}' cannot start or end with whitespace`));
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
      reject(new Error(`Field: '${tooSmallField}' must be at least ${min} characters long`));
    }
  
    const tooLargeField = Object.keys(sizedFields).find(
      field => 'max' in sizedFields[field] &&
        req.body[field].trim().length > sizedFields[field].max
    );
  
    if (tooLargeField) {
      const max = sizedFields[tooLargeField].max;
      reject(new Error(`Field: '${tooLargeField}' must be at most ${max} characters long`));
    }
    let { password, organizationName, email, hourlyRate } = req.body; 
    let user = {password, organizationName, email, hourlyRate }; 
    resolve(user); 
  }); 
 
}

module.exports = validateUser; 