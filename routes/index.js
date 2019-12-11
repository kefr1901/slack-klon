var express = require('express');
var router = express.Router();

/* GET home  root page. AKA patriks inlogg */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// When you login from rootpage to chat
router.get('/chat', function(req, res, next) {
  res.render('chat', { title: 'Express' });
});

router.post()
/* skriv ett objekt med information som du vill skriva ut*/


module.exports = router;

