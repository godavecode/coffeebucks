var mongoose = require('mongoose');
var Schema = mongoose.Schema;	//use mongoose schema object

var schema = new Schema({	//defines how data should look like based in this blueprint
	imagePath: {type: String, required: true}, 		//will store the path to the image
    description: {type: String, required: true},  
    price: {type: Number, required: true} 
}); 

module.exports = mongoose.model('Product', schema);		//export output of file with model.exports
