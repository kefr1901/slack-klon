var express = require('express');
var router = express.Router();
let multer = require("multer");
const ejs = require('ejs');
const path = require('path');

//set storage engine with multer
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + //here we say that the name of the file should be the fieldname(myImage)add timestamp and the the path on the file name
        path.extname(file.originalname)) //add format name on the file name
    }
});

//init upload
const upload = multer({
    storage: storage, //for storage we are using our storage engine above
    limits: {fileSize: 1000000}, //sets the limit on the file upload to 1mb
    fileFilter: function(req, file, cb) {
        //check filetype
        function checkFile(file, cb) {
            //which extensions that are allowed
            const fileTypes = /jpeg|jpg|png/;
            //see which extensions tat are allowed
            const extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
            //check mimetype
            const mimetype = fileTypes.test(file.mimetype);
            if(mimetype && extname) {
                return cb(null, true);
            } else {
                cb('Error: Images only');
            }
        }; checkFile(file, cb);
    }
}).single('myImage');

//when submitting an image
router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if(err) {
            res.render('index', { //if error then rerender the page and send in the error into the variable msg that consist on the .ejs-file
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'Error: No file selected'
                });
            } else {
                res.render('index', {
                    msg: 'File uploaded',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });

});

module.exports = router;