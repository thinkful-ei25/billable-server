const express = require('express'); 
const router = express.Router(); 


router.get('/', (req, res) => { 
  console.log('test endpoint'); 
  res.json('hi'); 
}); 


module.exports = router; 