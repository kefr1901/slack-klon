var express = require('express');
var router = express.Router();

//get userID
router.get('/user/:id', (req, res) => {
  let db = req.db;
  let collection = db.get('usercollection');
  collection.findOne({ _id: req.params.id }, (e, user) => {
    if (e) throw e;
    // console.log(user);
    res.send(JSON.stringify(user));
  })
})

//render CHAT
router.get('/', function (req, res) {
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
    // console.log( message);
    res.render("chat", { data: user, message: message });
  });
});

module.exports = router;