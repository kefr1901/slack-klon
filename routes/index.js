var express = require('express');
var router = express.Router();

/* GET home  root page. AKA patriks inlogg */
router.get('/', function(req, res, next) {
  res.render('chat', { title: 'Express' });
});


module.exports = router;

