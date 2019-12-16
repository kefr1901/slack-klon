var express = require('express');
var router = express.Router();

/* GET New User and Login page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Add New User' });
});

router.get('/chat', function (req, res) {
  let db = req.db;
  let collection = db.get("usercollection");
  collection.find({}, {}, function (e, data) {
    if (e) {
      throw e;
    }
    res.render("chat", { data: data })
  });
});

/* GET users listing. THIS IS NOT IN USE ATM*/
router.get('/list', function (req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({}, {}, function (e, data) {
    res.render('list', {
      "userlist": data
    });
  });
});

/* GET login - Check if there is a user with that name and password, then redirect to get request on line 37 */
router.post('/login', function (req, res, next) {
  let enteredUsername = req.body.username;
  let enteredPassword = req.body.userpassword;
  var db = req.db;
  var collection = db.get('usercollection');
  collection.findOne({ username: enteredUsername, userpassword: enteredPassword }, function (e, data) {
    console.log(data);
    if (e || data == null) {
      console.log('Username or password is wrong')
      res.redirect('/');
    } else {
      res.redirect('/chat'); //to avoid having /login in the address field in the browser
    }
  });
});

router.get('/chat', function (req, res) {
  res.render('chat')
});

/* POST to Add User Service */
router.post('/chat', function (req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var userName = req.body.username;
  var userPassword = req.body.userpassword;

  // Set our collection
  var collection = db.get('usercollection');

  // Submit to the DB
  collection.insert({
    "username": userName,
    "userpassword": userPassword
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
    }
    else {
      // And forward to success page
      res.render("chat");
      // res.redirect("list"); this was the old shit when printing all the users as a list
    }
  });

});

module.exports = router;