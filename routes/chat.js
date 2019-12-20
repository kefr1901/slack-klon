var express = require('express');
var router = express.Router();

//get userID
router.get('/user/:id', (req, res) => {
  let db = req.db;
  let collection = db.get('usercollection');
  collection.findOne({ _id: req.params.id }, (e, user) => {
    if (e) throw e;
    res.send(JSON.stringify(user));
  })
})

//render CHAT
router.get('/', function (req, res) {
  //let data;
  //let message;
  let db = req.db;
  let collection = db.get("usercollection");
  let messagecollection = db.get("messagecollection");

  collection.find({}, {}, function (e, data) {
   user = data;

    //console.log(data)
    if (e) {
      throw e;
    }
    res.cookie('user', req.session.user._id, { maxAge: 3600, httpOnly: false });
    //console.log('uid: ' + req.session.user._id);
  });
  messagecollection.find({}, {}, function (e, message) {
    message = message;
    res.render("chat", { data: user, message: message });
  });
});







// POST to Add User Service 
router.post('/', function (req, res) {

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
      res.redirect("chat");
      // res.redirect("list"); this was the old shit when printing all the users as a list
    }
  });
});

module.exports = router;
