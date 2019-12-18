var express = require('express');
var app = express();
var server = require('http').Server(app);
// var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//DATABASE CONNECT
let monk = require("monk");
var db = monk('mongodb+srv://patrikjohansson:Skateboard@cluster0-knble.mongodb.net/snackdb?retryWrites=true&w=majority');
var io = require('socket.io')(server);
const cookieSession = require('cookie-session');

//make out DB accesible to our router
app.use(function (req, res, next) {
  req.db = db;
  next();
});

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2', 'key3']
}))

//var indexRouter = require('./routes/chat');
var indexRouter = require("./routes/index");
// var usersRouter = require('./routes/users');
var chatRouter = require("./routes/chat");
var loginRouter = require("./routes/login");
var uploadRouter = require("./routes/upload");
var registerRouter = require("./routes/register");
var roomRouter = require("./routes/room");



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
      name: users[socket.id], //personID på personen
      message: message  //meddelande från personen
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

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/chat', chatRouter);
app.use("/login", loginRouter);
app.use("/upload", uploadRouter);
app.use("/register", registerRouter);
app.use("/room", roomRouter)




server.listen(3001);
console.log("lyssnar på app: 3001")

module.exports = app;

