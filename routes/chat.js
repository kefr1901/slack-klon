var express = require('express');
var router = express.Router();


/* GET HOME CHAT ROOM */
router.get('/', function (req, res) {
  res.render("chat");
});

 // let users = await db.usercollection.find().then(users => {
   // return users
  
  //users = users.map(user => user.username);
 // res.render('chat', { username: users });

//});





module.exports = router;

