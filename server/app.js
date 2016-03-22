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
//var http = require('http');
var request = require('request');

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


// TODO look up node schedule, we need to start this code a the beginning of everyday
setImmediate(startInterval);


// Scans through our DB and add the time to send inside
// our notificationList

/* {token: "", 
    dates: [{
      workouts: 5, 
      list:['00:30', '12:30']
      }]
   }
*/
function startInterval() {
  setInterval(addNewQuery, 24 * 60 * 60 * 1000);
  addNewQuery()
}

function addNewQuery() {
  console.log("add new Query")
  var collection = db.get('usercollection3');
  var currentDay = new Date();
  var day = (currentDay.getDay()+6) % 7;

  collection.find({}, {}, function(e, docs) {
    console.log(docs);
    for(var i = 0; i < docs.length; i++){
      console.log("going through list");
      var list = docs[i].dates[day].list;
      for(var r = 0; r < docs[i].dates[day].workouts; r++) {
        console.log("starting to look at list");
        if (list.length == 0) {
          break;
        }
        var randomTime = (Math.random() * list.length);
        sendRequest(list[randomTime], docs[i].timezone, docs[i].token);
        list.splice(randomTime, 1);
        console.log("sliced and done");
      }
    }
  });

}

function sendRequest(time, timezone, userToken) {
  console.log('starting to send push request')
  var d = new Date()
  var currentYear = d.getFullYear();
  var currentDate = d.getDate();
  if (currentDate < 10){
    currentDate = '0' + currentDate;
  }

  var currentMonth = d.getMonth() + 1;
  if (currentMonth < 10){
    currentMonth = '0'+currentMonth;
  }
  var prefix = (timezone < 0) ? "+" : "-";
  timezone = Math.abs(timezone);
  if (timezone < 10) {
    timezone = "0" + timezone;
  }
  var bodyData = {
    "tokens": [userToken],
    "profile": 'test2',
    "send_to_all": false,
    "scheduled": currentYear + "-" +  currentMonth + "-" + currentDate + "T" + 
      time + ":00" + prefix + timezone + ":00",
    "notification": {
      "title": "It's time!",
      "message": 'Click to start your daily scheduled pushups',
      "sound" : 'sound.wav'
    }
  }
  request({
    headers: {
      'content-type': 'application/json'
    },
    uri: "https://api.ionic.io/push/notifications",
    body: JSON.stringify(bodyData),
    method: "POST",
    auth: {
      'bearer':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNzUxYzM5MC0yZjA3LTQxN2YtOTBhMy02YzBiYTBmNzdiZTQifQ.QXR3c389xsGRRMiKOwPa5fZ_ggxE22vjwABs2VR7TPc'
    }
  }, function(err, res, body) {
    console.log(body);
  })
  console.log("push sent");
}

module.exports = app;
