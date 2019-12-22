var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
    var db = req.db;
    var userName = req.body.username;
    var userPassword = req.body.userpassword;
    var collection = db.get('usercollection');

    //submits to db
    collection.insert({
        "username": userName,
        "userpassword": userPassword
    }, function (err, doc) {
        if (err) {
            throw err;
        }
        else {
            req.session.user = { _id: doc._id };
            res.redirect("/chat");
        }
    });
});

module.exports = router;