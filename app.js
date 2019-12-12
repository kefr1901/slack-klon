var express = require('express');
var app = express();
var server = require('http').Server(app);
//var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//DATABASE CONNECT
let monk = require("monk");
var db = monk('mongodb+srv://kevinfridman:Skateboard@cluster0-knble.mongodb.net/snackdb?retryWrites=true&w=majority');
var io = require('socket.io')(server)

//make out DB accesible to our router

app.use(function (req, res, next) {
  req.db = db;
  next();
})

//var indexRouter = require('./routes/chat');
var usersRouter = require('./routes/users');
var chatRouter = require("./routes/chat");


// Object with the names of users
const users = {};

// När en användare connectar till chatten
io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);

  })

  // När en anvädare skriver
  socket.on('send-chat-message', message => {
    let messageForDb = { //skapar ett objekt av meddelandet och vem som är användare
      message: message,  //meddelande från personen
      name: users[socket.id] //personID på personen
    }
      
    var collection = db.get('messagecollection');//skapar collection messagecollection
    collection.insert(messageForDb); // Skickar objektet till databasen

    socket.broadcast.emit('chat-message', { //skriver ut till klienten
      message: message, 
      name: users[socket.id]
    })

    // When a user disconnects from chat
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', users[socket.id])
      delete users[socket.id]
    });
  })
})



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/chat", chatRouter);


server.listen(3000);

console.log("Lyssnar på app: 3000");
module.exports = app;

