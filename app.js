var createError = require('http-errors');
var express = require('express')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var monk = require('monk');
var db = monk('mongodb+srv://patrikjohansson:Skateboard@cluster0-knble.mongodb.net/snackdb?retryWrites=true&w=majority');

// var indexRouter = require('./routes/index');
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function (req, res, next) {
  req.db = db;
  next();
});

app.use('/', indexRouter);
// app.use('/users', usersRouter);

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

<<<<<<< HEAD
<<<<<<< HEAD
console.log("Hej då")

app.listen(5000);

module.exports = app;
=======
module.exports = app;
>>>>>>> development-patrik
=======
app.listen(3000, () => console.log("Server is running on port 3000")); //appens server
app.listen(4000, () => console.log("Server is running on port 4000")); //chattens server

module.exports = app;
>>>>>>> ef272f056b1172c7df02ab2b4320c504d769fa0b
