var express = require('express');
var router = express.Router();

router.get('/user/:id', (req, res) => {
  let db = req.db;
  let collection = db.get('usercollection');
  collection.findOne({_id: req.params.id}, (e, user) => {
    if (e) throw e;
    res.send(JSON.stringify(user));
  })
})

router.get('/', function (req, res) {
  let db = req.db;
  let collection = db.get("usercollection");
  collection.find({}, {}, function (e, data) {
    console.log(data)
    if (e) {
      throw e;
    }
    res.cookie('user', req.session.user._id, { maxAge: 3600, httpOnly: false });
    console.log('uid: ' + req.session.user._id);
    res.render("chat", { data: data })
  });
});





module.exports = router;

