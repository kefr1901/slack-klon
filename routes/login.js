var express = require('express');
var router = express.Router();
// let multer = require("multer");

/* Login - Check if there is a user with that name and password, then redirect to get request on line 37 */
router.post('/', function (req, res, next) {
    console.log("den gör ett post req");
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
            req.session.user = { _id: data._id };
            res.redirect('/chat'); //to avoid having /login in the address field in the browser
        }
    });
});

module.exports = router;