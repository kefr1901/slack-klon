var express = require('express');
var router = express.Router();
let multer = require("multer");
const path = require('path');
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +//here we say that the name of the file should be the fieldname(myImage)add timestamp and the the path on the file name
            path.extname(file.originalname)) //add format name on the file name
    }
});

//init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, //sets the limit on the file upload to 1mb
    fileFilter: function (req, file, cb) {
        //check filetype
        function checkFile(file, cb) {
            const fileTypes = /jpeg|jpg|png/;
            const extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
            const mimetype = fileTypes.test(file.mimetype);
            if (mimetype && extname) {
                return cb(null, true);
            } else {
                cb('Error: Images only');
            }
        }; checkFile(file, cb);
    }
}).single('myImage');

//Submit an image
router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('chat', { //if error then rerender the page and send in the error into the variable msg that consist on the .ejs-file
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('chat', {
                    msg: 'Error: No file selected'
                });
            } else {
                //this below defines data again
                let db = req.db;
                let collection = db.get("usercollection");
                let roomcollection = db.get("roomcollection");
                let messagecollection = db.get("messagecollection");
                roomcollection.find({}, {}, function (e, rooms) {
                messagecollection.find({}, {}, function (e, message) {
                    collection.find({}, {}, function (e, data){
                        if (e) {
                            throw e;
                        } else {
                            //here we can put in a path to the image maybe in the future
                            res.cookie('user', req.session.user._id, { maxAge: 3600, httpOnly: false });
                            res.render('chat', {
                                file: `uploads/${req.file.filename}`,
                                message: message,
                                data: data,
                                roomName: req.params.room,
                                rooms: rooms
                            });
                        };
                    });
                    });
                });
            }
        }
    });
});
module.exports = router;