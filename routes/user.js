var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();	//csrf as middleware
router.use(csrfProtection);		//all routes protected by csrf protection

router.get('/profile', isLoggedIn, function(req, res, next) {	//if signup is successfull
  res.render('user/profile');	//render the profile page
}); 						

//logout functionality
router.get('/logout', isLoggedIn, function(req, res, next) {
	req.logout();		//method from passport
	res.redirect('/');	//user was able to logout
})

router.use('/', notLoggedIn, function(req, res, next) {		//check if not logged in
	next();
}); 

router.get('/signup', function(req, res, next) {
  var messages = req.flash('error'); 	//get flash messages stored in the request
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});		//pass stored messages to the view
});

router.post('/signup', passport.authenticate('local.signup', {		//local.signup strategy defined
  successRedirect: '/user/profile', 	//if success, redirect to profile
  failureRedirect: '/user/signup', 		//if failure, redirected to signup
  failureFlash: true 	//use flash to see a message
}));

router.get('/signin', function(req, res, next) { 	//create route for the signin strategy
  var messages = req.flash('error'); 				//get flash messages stored in the request
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});		//pass stored messages to the view
});

router.post('/signin', passport.authenticate('local.signin', { 		//post route for user signin and use passport authenticate
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next) { 	
	if(req.isAuthenticated()){ 		//protect this routes with method managed by passport isAutheticated
		return next(); 				//continue
	}
	res.redirect('/');
}

function notLoggedIn(req, res, next) {	
	if(!req.isAuthenticated()) { 	//protect this routes with method managed by passport isAutheticated
		return next();				//continue
	}
	res.redirect('/');
}