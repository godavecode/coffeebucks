var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs'); //bcrypt is used to hash the password

var userSchema = new Schema({
	email: {type: String, required: true},
	password: {type: String, required: true}
}); 

userSchema.methods.encryptPassword = function(password) {		//creating encrypted password and this function expects a password
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);	//return the hashed password using bcrypt, then the syncronous hash, pass password, generate salt for hash use 5 rounds of salt creation
};          

userSchema.methods.validPassword = function(password) { 	//bcrypt checks if a password matches the hashed password
	return bcrypt.compareSync(password, this.password);  	
};

module.exports = mongoose.model('User', userSchema);

