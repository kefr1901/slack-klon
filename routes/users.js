var express = require('express');
var router = express.Router();

/* GET New User page. */
router.get('/add', function (req, res) {
  res.render('users/add', { title: 'Add New User' });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({}, {}, function (e, data) {
    res.render('users/list', {
      "userlist": data
    });
  });
});

/* GET login - Check if there is a user with that name and password, then redirect */
router.post('/login', function(req, res, next) {
  let enteredUsername = req.body.username;
  let enteredPassword = req.body.userpassword;
  var db = req.db;
  var collection = db.get('usercollection');
  collection.findOne({username: enteredUsername, userpassword: enteredPassword}, function (e, data) {
    if(e || data == null){
      console.log('Username or password is wrong')
      res.render('users/add');
    }else{
      res.render('users/login');
    }
  });
});

/* POST to Add User Service */
router.post('/add', function (req, res) {

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
      res.redirect("/users");
    }
  });

});

module.exports = router;