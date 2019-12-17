var express = require('express');
var router = express.Router();

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
            req.session.user = { _id: doc._id };
            res.redirect("/chat");
            
        }
    });

});

// router.get('/chat', function (req, res) {
//     res.render('chat')
// });













module.exports = router;