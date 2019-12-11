var express = require('express');
var app = express();
var server = require('http').Server(app);
//var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var io = require('socket.io')(server);
let db = monk("localhost:27017/mongochat")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);





// Below happens when a user connects
io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  })
  // When a message is sent from a user
  socket.on('send-chat-message', message => {
      socket.broadcast.emit('chat-message', { message: message, name: 
      users[socket.id] })
  })
  // When a user disconnects from chat
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
})
})




server.listen(3000);

console.log("app:3000");
module.exports = app;
