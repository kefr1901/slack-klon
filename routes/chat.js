var express = require('express');
var router = express.Router();

//FUNKAR INTE 

/* GET HOME CHAT ROOM */
router.get('/chat', function (req, res) {
  res.render('chat', { title: 'Add New User' });
});

 // let users = await db.usercollection.find().then(users => {
   // return users
  
  //users = users.map(user => user.username);
 // res.render('chat', { username: users });

//});





module.exports = router;

