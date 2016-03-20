var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var gcm = require("node-gcm");
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:55555/test');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    console.log("loading db")
    req.db = db;
    next();
});


app.use('/', routes);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

setInterval(sendPushNotification, 15 * 60 * 1000);

// TODO look up node schedule, we need to start this code a the beginning of everyday
setInterval(addNewQuery, 24 * 60 * 60 * 1000);

notificationList = [];

// Scans through our notification list to see if there
// are people we need to send notifications to.
function sendPushNotification() {

}


// Scans through our DB and add the time to send inside
// our notificationList
function addNewQuery() {

}

module.exports = app;
