var express = require('express');
var router = express.Router();


/* GET HOME CHAT ROOM */
router.get('/', function(req, res, next) {
  res.render('chat', { title: 'Express' });
});





module.exports = router;

