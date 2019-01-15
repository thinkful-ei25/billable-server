const express = require('express'); 
const router = express.Router(); 

router.get('/', (req, res) => { 
  console.log('test'); 
  res.json('test worked'); 
}); 

module.exports = router; 