var Product = require('../models/product');	//import product model

var mongoose = require('mongoose'); //connect with mongoose

mongoose.connect('mongodb://api:quaker@ds053196.mlab.com:53196/coffeecom'); //connect with mLab 

var products = [
	new Product({ 	//create a new product the model; pass the javascript object to the database
		imagePath: 'http://cookdiary.net/wp-content/uploads/images/Mocha-Coffee_6845.jpg', //image
		title: 'Caffe Mocha', //name
		description: 'Delicious mocha coffee!', //description
		price: 4 //price
	}),
	new Product({ //create a new product the model; pass the javascript object to the database
		imagePath: 'http://www.attibassicafe.com/wp-content/uploads/2013/02/web10.jpg', //image
		title: 'Caffe Latte', //name
		description: 'Delicious cafe latte coffee!', //description
		price: 5 //price
	}),
	new Product({ //create a new product the model; pass the javascript object to the database
		imagePath: 'http://www.tampabay.com/resources/images/dti/rendered/2009/06/food_cappuccino_73346a_8col.jpg', //image
		title: 'Caffe Cappuccino', //name
		description: 'Delicious cappuccino coffee!', //description
		price: 3 //price
	}),
	new Product({ //create a new product the model; pass the javascript object to the database
		imagePath: 'https://s-media-cache-ak0.pinimg.com/236x/3a/1c/18/3a1c187f657ebd50682861139d317199.jpg', //image
		title: 'Caffe Macchiato', //name
		description: 'Delicious macchiato coffee!', //description
		price: 4 //price
	}),
	new Product({ //create a new product the model; pass the javascript object to the database
		imagePath: 'http://cdn.taccuinistorici.it/preview_images/news/2119_0.jpg', //image
		title: 'Caffe Espresso', //name
		description: 'Delicious espresso coffee!', //description
		price: 2 //price
	})
];

var done = 0;
for (var i = 0; i < products.length; i++) {		//loop through products
	products[i].save(function(err, result) { 	//callback of each save operation
		done++; 	//increment done by one
		if (done === products.length) { 	//check if done is equal to products length
			exit(); 		//call the exit function see below
		}
	}); 
}
function exit() { 	//in this function we disconnect
	mongoose.disconnect();
}