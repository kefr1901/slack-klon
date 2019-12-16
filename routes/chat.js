//socket-grejer
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('chat')
});

/* POST to Add User Service */
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
            res.render("chat");
            // res.redirect("list"); this was the old shit when printing all the users as a list
        }
    });
});

module.exports = router;