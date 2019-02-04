'use strict'; 

function validateUser(req){ 
  return new Promise(function(resolve, reject) { 
    const requiredFields = ['organizationName', 'email', 'password']; 
    const missingField = requiredFields.find(field => !(field in req.body)); 
  
    if (missingField ) { 
      const err = new Error(`Missing '${missingField}' in request body`);
      err.status = 422;
      reject(err);
    }
  
    const stringFields = ['organizationName', 'password', 'email']; 
    const nonStringField = stringFields.find(field => !(field in req.body)); 
  
    if (nonStringField) { 
      const err = new Error(`Field: '${nonStringField}' must be type String`);
      err.status = 422;
      reject(err);
    }
  
    const explicityTrimmedFields = ['organizationName', 'password', 'email'];
    const nonTrimmedField = explicityTrimmedFields.find(
      field => req.body[field].trim() !== req.body[field]
    );
  
    if (nonTrimmedField) {
      err.status = 422;
      reject(err);
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
    let { password, organizationName, email} = req.body; 
    let user = {password, organizationName, email}; 
    resolve(user); 
  }); 
 
}

module.exports = validateUser; 
