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
  keys: ['key1', 'key2']
}))

//var indexRouter = require('./routes/chat');
var indexRouter = require("./routes/index");
// var usersRouter = require('./routes/users');
var chatRouter = require("./routes/chat");
var loginRouter = require("./routes/login");
var uploadRouter = require("./routes/upload");
var registerRouter = require("./routes/register");


// Object with the names of users
const rooms = {};

let collection = db.get("usercollection");

  collection.find({}, function (e, data) {
    for(i = 0; i < data.length; i++){
      if(data[i].username != rooms[data[i].username])
      rooms[data[i].username] = {users: {}}
  }
  })

// När en användare connectar till chatten
io.on('connection', socket => {
  socket.on('new-user', (room, name) => {
    rooms[room].users[socket.id] = name;
    socket.to(room).broadcast.emit('user-connected', name);
    
  })

  // När en anvädare skriver
  socket.on('send-chat-message', (room, message) => {
    let messageForDb = { //skapar ett objekt av meddelandet och vem som är användare
      message: message, name:  //meddelande från personen
        rooms[room].users[socket.id] //personID på personen
        
    }
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
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
      delete rooms[room].users[socket.id]

    });
  })
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
app.use('/login', loginRouter);
app.use('/upload', uploadRouter);
app.use('/register', registerRouter);

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/');
  }
  rooms[req.body.room] = { users: {} }
  res.redirect(req.body.room)
  io.emit('room-created', req.body.room);

})

app.get('/', (req, res) => {
  res.render('index', { rooms: rooms })
})

// Gets the rooms created (need to make this work with database) and their names
app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/');
  }
  let collection = db.get("usercollection");
  collection.find({}, {}, function (e, data) {

  var roomName = req.params.room;
  var collection = db.get('roomcollection');

  collection.insert({
    "roomname": roomName
  })
    res.render('room', { rooms: rooms, roomName: req.params.room, data: data })
  })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//kan vara problem


//app.listen(4000, () => console.log("Server is running on port 4000")); //appens server

//app.use('/', indexRouter);


server.listen(3001);

module.exports = app;

