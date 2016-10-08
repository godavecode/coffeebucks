var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');   
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');  
var validator = require('express-validator'); 
var MongoStore = require('connect-mongo')(session); 

var routes = require('./routes/index');
var userRoutes = require('./routes/user');

var app = express();

mongoose.connect('mongodb://api:quaker@ds053196.mlab.com:53196/coffeecom');   //connection to mLab
require('./config/passport');   //require package load variable to setup passport

app.use(logger('dev'));
app.use(bodyParser.json());   //parse the body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());   //retrieve the parameters to validate
app.use(cookieParser());
app.use(session({     //session initialization
  secret: 'mysupersecret', 
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),    //add new mongo store, specify the mongoose connection key to use existing connection
  cookie: { maxAge: 180 * 60 * 1000 }                                    //option to the store; 180 minutes or 3 hours in milliseconds
})); 
app.use(flash());   //initialize flash
app.use(passport.initialize());
app.use(passport.session());  //store the user
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();   //setting global variable; if true logged in then show user account logout button; if false show signup or signin
  res.locals.session = req.session;   //pass the session object
  next();   //continue
});

app.use('/user', userRoutes);   //check if prefix is user, redirect to user routes
app.use('/', routes); //redirect to root

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler will print stacktrace
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


module.exports = app;
