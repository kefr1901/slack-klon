var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ storage: storage });
var fs = require('fs');

// SET STORAGE for the photo upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});
// var upload = multer({ storage: storage });

/* GET New User and Login page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Add New User' });
});

/* GET users listing. THIS IS NOT IN USE ATM*/
router.get('/list', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({}, {}, function (e, data) {
    res.render('list', {
      "userlist": data
    });
  });
});

/* GET login - Check if there is a user with that name and password, then redirect to get request on line 37 */
router.post('/login', function(req, res, next) {
  let enteredUsername = req.body.username;
  let enteredPassword = req.body.userpassword;
  var db = req.db;
  var collection = db.get('usercollection');
  collection.findOne({username: enteredUsername, userpassword: enteredPassword}, function (e, data) {
    console.log(data);
    if(e || data == null){
      console.log('Username or password is wrong')
      res.redirect('/');
    }else{
      res.redirect('/chat'); //to avoid having /login in the address field in the browser
    }
  });
});

router.get('/chat', function (req, res) {
  res.render('chat')
});

/* POST to Add User Service */
router.post('/chat', function (req, res) {

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

// router.post('/uploadphoto', upload.single('myImage'), (req, res, next) => {
//   console.log('går in i funktionen för att ladda upp en fil');
//   const file = req.file;
//   if (!file) {
//     const error = new Error('Please upload a file')
//     error.httpStatusCode = 400
//     return next(error)
//   }
//     res.send(file);
//     res.render("photo"); 
// });

//posting an image to the db when submitting
router.post('/uploadphoto', upload.single('myImage'), (req, res) => {
  console.log('går in i funktionen');
  var img = fs.readFileSync(req.file.path);
  var encode_image = img.toString('base64');
  // Define a JSONobject for the image attributes for saving to database

  var photocollection = db.get('photocollection');

  var finalImg = {
    contentType: req.file.mimetype,
    image:  new Buffer(encode_image, 'base64')
  };
  photocollection('quotes').insertOne(finalImg, (err, result) => {
    console.log(result)

    if (err) return console.log(err)

    console.log('saved to database');
    res.redirect('/chat');
  });
});

module.exports = router;