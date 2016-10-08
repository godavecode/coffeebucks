var passport =  require('passport');	//imports passport
var User = require('../models/user');	//import users model
var LocalStrategy = require('passport-local').Strategy; //import the local strategy object

passport.serializeUser(function(user, done){	//store the user in the session
	done(null, user.id);	//stores the user in the session and serialize it by id
});

passport.deserializeUser(function(id, done){	//passport will store the user in the session and retrieve it by id
	User.findById(id, function(err, user){ 		//find by id in mongodb using mongoose
		done(err, user);
	}); 
});

passport.use('local.signup', new LocalStrategy({ 
	usernameField: 'email',		//keys the package expects
	passwordField: 'password',
	passReqToCallback: true 
}, function (req, email, password, done) {	//callback to get the request, email and password; done to tell passport it completed successfully
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();	//validate the passed parameters
	req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4, });	//pass an object of a minimum length of 4 characters
	var errors = req.validationErrors();	//check if any validation errors appear 
	if (errors) { 							//if errors, create an array of messages to pass to the view.
		var messages = [];
		errors.forEach(function(error) {	//loop through errors; for each error push to messages array
			messages.push(error.msg);		//the msg field that the validator package adds for each error		
		});
		return done(null, false, req.flash('error', messages));		//no error but not successful; flash an error message
												                	//sending bundled messages to the view with flash; displaying messages in the view
	}	
	User.findOne({'email': email}, function (err, user) {	
		if(err) {
			return done(err);
		}
		if (user) {
			return done(null, false, {message: 'Email is already in use.'});	//no error but not successful; flash an error message
		}
		var newUser = new User();	//creating new user with the mongoose model
		newUser.email = email; 		//setting new user to email
		newUser.password = newUser.encryptPassword(password);	//password encrypedt with bcrypt
		newUser.save(function(err, result) {	//save the new user
			if (err) {
				return done(err);
			}
			return done(null, newUser);
		});
	});
}));	//signup a user strategy

passport.use('local.signin', new LocalStrategy({
	usernameField: 'email', 								
	passwordField: 'password',
	passReqToCallback: true 
}, function(req, email, password, done) {	//callback funtion to execute when done
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();	//validate the passed parameters
	req.checkBody('password', 'Invalid password').notEmpty();	//if not empty
	var errors = req.validationErrors(); 						//check if any validation errors appear 
	if (errors) {	//if any errors, creates an array of messages to pass to the view.
		var messages = [];
		errors.forEach(function(error) {	//for each error, will be pushed to messages array
			messages.push(error.msg); 		//msg field the validator package adds for each error		
		});
		return done(null, false, req.flash('error', messages)); //did not get error, but not successful; flash an error message
												     			//sending bundled messages to the view with flash
	}
	User.findOne({'email': email}, function (err, user) {	
		if(err) {
			return done(err);
		}
		if (!user) {
			return done(null, false, {message: 'No user found.'});	//no user found message; an email that is not in the database
		}
		if (!user.validPassword(password)) {	//verifying password with encrypted password in the database 
			return done(null, false, {message: 'Wrong password'});	//if false password is not valid
		}						
		return done(null, user);	//user found in the database
	});	
}));

