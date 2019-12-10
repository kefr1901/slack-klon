var express = require('express');
var router = express.Router();

/* GET home page. AKA patriks inlogg */
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'Express' });
});

/* skriv ett objekt med information som du vill skriva ut*/


module.exports = router;

