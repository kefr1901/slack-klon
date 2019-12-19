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

//render ROOM
router.post('/', function (req, res) {
  console.log("ETT POST REQ SKER");
  //let data;
  //let message;
  let db = req.db;
  let collection = db.get("usercollection");
  let messagecollection = db.get("messagecollection");
  let roomcollection = db.get("roomcollection");// and this
  collection.find({}, {}, function (e, data) {
    console.log("ROOM: " + req.params.room);
    roomcollection.insert({
      "roomname": req.params.room
    })
    console.log("SUCCESS ROOMS");
    //console.log(data)
    if (e) {
      throw e;
    }
    res.cookie('user', req.session.user._id, { maxAge: 3600, httpOnly: false });

    //console.log('uid: ' + req.session.user._id);

    roomcollection.find({}, {}, function (e, rooms) { // If things go to shit remove this
      messagecollection.find({}, {}, function (e, message) {
        message = message;
        //console.log( message);
        res.render("room", { message: message, data: data, rooms: rooms });
      });
    })
  })
});


module.exports = router;
