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
  let db = req.db;
  let collection = db.get("usercollection");
  let messagecollection = db.get("messagecollection");
  let roomcollection = db.get("roomcollection");

  collection.find({}, {}, function (e, data) {
   user = data;

   roomName = "chat";
    if (e) {
      throw e;
    }
    res.cookie('user', req.session.user._id, { maxAge: 3600, httpOnly: false });
  });
  roomcollection.find({}, {}, function (e, rooms) {
  messagecollection.find({room: roomName}, {}, function (e, message) {
    message = message;
    res.render("chat", { data: user, message: message, rooms: rooms, roomName: roomName });
  });
})
});

module.exports = router;
