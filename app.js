var express = require('express');
var app = express();
var server = require('http').Server(app);
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var io = require('socket.io')(server);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Object with the names of users
const users = {};

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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var rooms = {};

app.get('/', (req, res) => {
  res.render('index', {rooms: rooms})
})

// Gets the rooms created (need to make this work with database) and their names
app.get('/:room', (res, req) => {
  res.render('room', { roomName: req.params.room })
})

// NEED TO ADD ROOM POST

server.listen(3000);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(5000);

module.exports = app;
