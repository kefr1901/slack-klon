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
const rooms = {};

let roomcollection = db.get("roomcollection");

roomcollection.find({}, function (e, data) {
  for (i = 0; i < data.length; i++) {
    if (data[i].roomname != rooms[data[i].roomname])
      rooms[data[i].roomname] = { users: {} }
  }
})

// När en användare connectar till chatten
io.on('connection', socket => {
  socket.on('new-room', (room, name) => {
    socket.join(room);
    rooms[room].users[socket.id] = name;
    socket.to(room).broadcast.emit('user-connected', name);
  })

  // När en anvädare skriver
  socket.on('send-chat-message', (room, message) => {
    let messageForDb = { //skapar ett objekt av meddelandet och vem som är användare
      message: message, name:  //meddelande från personen
      rooms[room].users[socket.id] //personID på personen
      

    }
    console.log("HERE", rooms);
    var collection = db.get('messagecollection');//skapar collection messagecollection
    collection.insert(messageForDb); // Skickar objektet till databasen

    socket.to(room).broadcast.emit('chat-message', {  //skriver ut till klienten
      message: message, name:
      rooms[room].users[socket.id]

    })
  })

  // When a user disconnects from chat
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
    socket.broadcast.emit('user-disconnected', rooms[room].users[socket.id])
    delete rooms[room].users[socket.id]
  })
  });
})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name);
    return names;
  }, [])
}


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

//get userID
app.get('/user/:id', (req, res) => {
  let collection = db.get('usercollection');
  collection.findOne({ _id: req.params.id }, (e, user) => {

    
    // console.log(user);
    res.send(JSON.stringify(user));
  })
})

//render ROOM
app.get('/:room', function (req, res) {

  let collection = db.get("usercollection");
  let messagecollection = db.get("messagecollection");
  let roomcollection = db.get("roomcollection");// and this
  let room = req.params.room;
  collection.find({roomname: room}, {}, function (e, data) {
    
    if(rooms[room] != rooms){
    let newRoom = roomcollection.insert({
      "roomname": room
    })
  
    rooms[room] = { users: {} }
  }
    if (e) {
      throw e;
    }
    res.cookie('user', req.session.user._id, { maxAge: 3600, httpOnly: false });

    roomcollection.find({}, {}, function (e, rooms) { // If things go to shit remove this
      messagecollection.find({}, {}, function (e, message) {
        message = message;
        res.render("room", { message: message, data: data, rooms: rooms, roomName: room });
      });
    })
  })
});

// POST to Add User Service 
app.post('/room', function (req, res) {

res.redirect(req.body.room);
})



server.listen(3001);

module.exports = app;

