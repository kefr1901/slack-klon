var express = require('express');
var router = express.Router();
let multer = require("multer");
const ejs = require('ejs');
const path = require('path');
//set storage engine with multer
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +//here we say that the name of the file should be the fieldname(myImage)add timestamp and the the path on the file name
            path.extname(file.originalname)) //add format name on the file name
    }
});

//init upload
const upload = multer({
    storage: storage, //for storage we are using our storage engine above
    limits: { fileSize: 1000000 }, //sets the limit on the file upload to 1mb
    fileFilter: function (req, file, cb) {
        //check filetype
        function checkFile(file, cb) {
            //which extensions that are allowed
            const fileTypes = /jpeg|jpg|png/;
            //see which extensions tat are allowed
            const extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
            //check mimetype
            const mimetype = fileTypes.test(file.mimetype);
            if (mimetype && extname) {
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
        if (err) {
            console.log("HAHAHAHHA");
            res.render('chat', { //if error then rerender the page and send in the error into the variable msg that consist on the .ejs-file
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('chat', {
                    msg: 'Error: No file selected'
                });
            } else {
                //detta definierar data återigen. de fyra raderna nedan
                let db = req.db;
                let collection = db.get("usercollection");
                let messagecollection = db.get("messagecollection");
                messagecollection.find({}, {}, function (e, message) {
                    collection.find({}, {}, function (e, data){
                        if (e) {
                            throw e;
                        } else {
                            //HÄR HADE MAN KUNNAT ATT KANSKE SATT EN SÖKVÄG TILL BILDEN TILL ANVÄNDAREN
                            res.cookie('user', req.session.user._id, { maxAge: 3600, httpOnly: false });
                            console.log('uid: ' + req.session.user._id);
                            //res.render("chat", { data: data })
                            // res.sendFile(`uploads/${req.file.filename}`);
                            res.render('chat', { //här har jag ändrat lite lallal kul!
                            // msg: 'File uploaded',
                                file: `uploads/${req.file.filename}`,
                                message: message,
                                data: data
                            });
                        };
                    });
                });
            }
        }
    });
});
module.exports = router;