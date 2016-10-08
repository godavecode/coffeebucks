var express = require('express');
var router = express.Router();
var Cart = require('../models/cart'); 

var Product = require('../models/product'); //importing product model

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err, docs) {  //products are fetched like db.product.find() in mongodb
  	var productChunks = []; 		      //empty array to start working 
  	var chunkSize = 3;
  	for (var i = 0; i < docs.length; i += chunkSize) { 		//loop until I reach the documents length
  		productChunks.push(docs.slice(i, i + chunkSize));	  //increase i by chunksize then push item to productChunks array
  	}												   		
  	res.render('shop/index', { title: 'Shopping Cart', products: productChunks });   //pass data to the view
  }); 
});	  
											
router.get('/add-to-cart/:id', function(req, res, next) {   //configure get route, push the product to add to cart and store it in a cart object 
  var productId = req.params.id;                            //retrieved with the id params; create a new cart
  var cart = new Cart(req.session.cart ? req.session.cart : {});  //new cart will be created; check if the cart property exists, if exists, pass my old cart else empty javascript object
  
  Product.findById(productId, function(err, product) {  //use mongoose to find my product by id
    if(err) {
      return res.redirect('/');   //redirect to root page
    }
     cart.add(product, product.id);   //add product fetched by database and product id
     req.session.cart = cart;         //store cart object in the session; automatically stored by express
     console.log(req.session.cart); 
     res.redirect('/');           //redirect to root page
  });                                     

});

router.get('/shopping-cart', function(req, res, next) {   //check if the cart is not set in the session
  if(!req.session.cart) {                                 //if condition to check if products are in cart or not
    return res.render('shop/shopping-cart', {products: null});    //render shopping cart view pass products to null 
  }
  var cart = new Cart(req.session.cart);    
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});                                  
});

module.exports = router; 